import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-297fba9e/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTH ENDPOINTS ==========

// Sign up new user
app.post("/make-server-297fba9e/auth/signup", async (c) => {
  try {
    const { email, password, fullName } = await c.req.json();

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server isn't configured
      user_metadata: { full_name: fullName },
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      fullName,
      subscriptionTier: 'free',
      documentsGeneratedThisMonth: 0,
      createdAt: new Date().toISOString(),
      subscriptionExpiresAt: null,
    });

    return c.json({
      message: 'User created successfully',
      userId,
      email,
    });
  } catch (err) {
    console.log(`Signup error: ${err}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get current user info
app.get("/make-server-297fba9e/auth/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Auth error: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${user.id}`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({
      id: user.id,
      email: user.email,
      ...userProfile,
    });
  } catch (err) {
    console.log(`Get user error: ${err}`);
    return c.json({ error: 'Failed to get user info' }, 500);
  }
});

// ========== DOCUMENT TEMPLATES ENDPOINTS ==========

// Get all templates
app.get("/make-server-297fba9e/templates", async (c) => {
  try {
    const templates = await kv.getByPrefix('template:');
    return c.json({ templates: templates || [] });
  } catch (err) {
    console.log(`Get templates error: ${err}`);
    return c.json({ error: 'Failed to get templates' }, 500);
  }
});

// Get template by slug
app.get("/make-server-297fba9e/templates/:slug", async (c) => {
  try {
    const slug = c.req.param('slug');
    const template = await kv.get(`template:${slug}`);

    if (!template) {
      return c.json({ error: 'Template not found' }, 404);
    }

    return c.json({ template });
  } catch (err) {
    console.log(`Get template error: ${err}`);
    return c.json({ error: 'Failed to get template' }, 500);
  }
});

// ========== DOCUMENT GENERATION ENDPOINTS ==========

// Generate and save document (requires auth)
app.post("/make-server-297fba9e/api/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Auth error during document generation: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user profile to check limits
    const userProfile = await kv.get(`user:${user.id}`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Check generation limits
    if (userProfile.subscriptionTier === 'free' && userProfile.documentsGeneratedThisMonth >= 3) {
      return c.json({ 
        error: 'Monthly limit reached',
        message: 'Вы достигли лимита в 3 документа для бесплатного тарифа. Оформите подписку для продолжения.',
        limitReached: true,
      }, 403);
    }

    const { templateSlug, documentData } = await c.req.json();

    // Create document record
    const docId = crypto.randomUUID();
    const now = new Date().toISOString();

    const document = {
      id: docId,
      userId: user.id,
      templateSlug,
      documentData,
      createdAt: now,
    };

    await kv.set(`document:${user.id}:${docId}`, document);

    // Increment user's document count
    userProfile.documentsGeneratedThisMonth += 1;
    await kv.set(`user:${user.id}`, userProfile);

    return c.json({
      message: 'Document generated successfully',
      document,
      remainingDocuments: userProfile.subscriptionTier === 'free' 
        ? Math.max(0, 3 - userProfile.documentsGeneratedThisMonth)
        : 'unlimited',
    });
  } catch (err) {
    console.log(`Generate document error: ${err}`);
    return c.json({ error: 'Failed to generate document' }, 500);
  }
});

// Get user's documents (requires auth)
app.get("/make-server-297fba9e/api/my-documents", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Auth error while fetching documents: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all documents for this user
    const documents = await kv.getByPrefix(`document:${user.id}:`);

    return c.json({ 
      documents: documents || [],
      count: documents?.length || 0,
    });
  } catch (err) {
    console.log(`Get documents error: ${err}`);
    return c.json({ error: 'Failed to get documents' }, 500);
  }
});

// ========== PAYMENT ENDPOINTS ==========

// Create payment (requires auth)
app.post("/make-server-297fba9e/api/create-payment", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Auth error during payment creation: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { tier, months } = await c.req.json();

    // Calculate amount based on tier
    const prices: Record<string, number> = {
      standard: 299,
      premium: 599,
    };

    const amount = prices[tier] * months;

    if (!amount) {
      return c.json({ error: 'Invalid tier' }, 400);
    }

    // Create payment record
    const paymentId = crypto.randomUUID();
    const payment = {
      id: paymentId,
      userId: user.id,
      amount,
      currency: 'RUB',
      tier,
      months,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`payment:${paymentId}`, payment);

    // In production, here you would integrate with YooKassa API
    // For now, returning mock payment data
    return c.json({
      paymentId,
      amount,
      currency: 'RUB',
      // In production: confirmationUrl from YooKassa
      message: 'Payment created. Integration with YooKassa required for production.',
    });
  } catch (err) {
    console.log(`Create payment error: ${err}`);
    return c.json({ error: 'Failed to create payment' }, 500);
  }
});

// Payment webhook (for YooKassa integration)
app.post("/make-server-297fba9e/api/webhook/payment", async (c) => {
  try {
    const data = await c.req.json();

    // In production, verify webhook signature from YooKassa

    if (data.event === 'payment.succeeded') {
      const paymentId = data.object.metadata?.paymentId;
      
      if (!paymentId) {
        return c.json({ status: 'ok' });
      }

      const payment = await kv.get(`payment:${paymentId}`);

      if (!payment) {
        console.log(`Payment ${paymentId} not found`);
        return c.json({ status: 'ok' });
      }

      // Update payment status
      payment.status = 'succeeded';
      await kv.set(`payment:${paymentId}`, payment);

      // Update user subscription
      const userProfile = await kv.get(`user:${payment.userId}`);
      
      if (userProfile) {
        userProfile.subscriptionTier = payment.tier;
        
        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + payment.months);
        userProfile.subscriptionExpiresAt = expiresAt.toISOString();
        
        await kv.set(`user:${payment.userId}`, userProfile);
      }
    }

    return c.json({ status: 'ok' });
  } catch (err) {
    console.log(`Payment webhook error: ${err}`);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// Reset monthly document counter (would be called by cron job)
app.post("/make-server-297fba9e/api/cron/reset-monthly-counters", async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    
    if (users) {
      for (const user of users) {
        user.documentsGeneratedThisMonth = 0;
        await kv.set(`user:${user.id}`, user);
      }
    }

    return c.json({ 
      message: 'Monthly counters reset successfully',
      usersUpdated: users?.length || 0,
    });
  } catch (err) {
    console.log(`Reset counters error: ${err}`);
    return c.json({ error: 'Failed to reset counters' }, 500);
  }
});

Deno.serve(app.fetch);