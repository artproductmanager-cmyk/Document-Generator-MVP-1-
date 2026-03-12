import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../utils/supabaseClient';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function useDocumentGeneration(templateSlug: string) {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const saveDocument = async (documentData: any) => {
    // Временно отключено для бесплатной версии
    // Документы генерируются без авторизации
    /*
    if (!user) {
      toast.error('Войдите в систему для сохранения документа');
      navigate('/login');
      return false;
    }

    setSaving(true);

    try {
      const response = await apiCall('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          templateSlug,
          documentData,
        }),
      });

      toast.success('Документ сохранён в личном кабинете');
      
      // Refresh user profile to update document count
      await refreshUserProfile();

      // Show remaining documents info
      if (response.remainingDocuments !== 'unlimited') {
        toast.info(`Осталось документов: ${response.remainingDocuments} из 3`);
      }

      return true;
    } catch (error: any) {
      console.error('Failed to save document:', error);
      
      if (error.message.includes('Monthly limit reached')) {
        toast.error('Лимит документов исчерпан', {
          description: 'Оформите подписку для продолжения',
          action: {
            label: 'Посмотреть тарифы',
            onClick: () => navigate('/pricing'),
          },
        });
      } else {
        toast.error('Не удалось сохранить документ');
      }

      return false;
    } finally {
      setSaving(false);
    }
    */
    
    // Пока что просто возвращаем true - документы бесплатные
    return true;
  };

  const checkLimit = (): boolean => {
    // Временно отключено - документы бесплатные без лимитов
    /*
    if (!user) {
      toast.error('Войдите в систему для создания документов', {
        action: {
          label: 'Войти',
          onClick: () => navigate('/login'),
        },
      });
      return false;
    }

    if (userProfile?.subscriptionTier === 'free' && 
        userProfile?.documentsGeneratedThisMonth >= 3) {
      toast.error('Лимит бесплатных документов исчерпан', {
        description: 'Оформите подписку для продолжения',
        action: {
          label: 'Посмотреть тарифы',
          onClick: () => navigate('/pricing'),
        },
      });
      return false;
    }
    */

    return true;
  };

  return {
    saveDocument,
    checkLimit,
    saving,
    user,
    userProfile,
  };
}