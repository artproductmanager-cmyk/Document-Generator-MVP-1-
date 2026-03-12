import { Link } from "react-router";
import { 
  FileText, 
  Home as HomeIcon, 
  Briefcase, 
  Users, 
  Search, 
  LogIn, 
  User,
  Key,
  HandCoins,
  Car,
  Banknote,
  Heart,
  Scale,
  Baby,
  Plane,
  FileSignature,
  Hammer,
  Package,
  Handshake,
  ClipboardCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { SEO } from "../components/SEO";
import { useAuth } from "../contexts/AuthContext";

interface DocumentType {
  id: string;
  title: string;
  description: string;
  path: string;
  category: "civil" | "family" | "business";
  popular?: boolean;
  icon: any;
  comingSoon?: boolean;
}

const documents: DocumentType[] = [
  // Гражданские сделки
  {
    id: "rental",
    title: "Договор аренды квартиры",
    description: "Создайте договор аренды жилого помещения между физическими лицами",
    path: "/dogovor-arendy-kvartiry",
    category: "civil",
    popular: true,
    icon: Key,
  },
  {
    id: "receipt",
    title: "Расписка в получении денег",
    description: "Документ, подтверждающий передачу денежных средств",
    path: "/raspiska-v-poluchenii-deneg",
    category: "civil",
    popular: true,
    icon: HandCoins,
  },
  {
    id: "car-sale",
    title: "Договор купли-продажи автомобиля",
    description: "Договор для безопасной продажи или покупки автомобиля",
    path: "/dogovor-kupli-prodazhi-avto",
    category: "civil",
    popular: true,
    icon: Car,
  },
  {
    id: "loan",
    title: "Договор займа",
    description: "Договор займа между физическими лицами с процентами или без",
    path: "/dogovor-zajma",
    category: "civil",
    popular: true,
    icon: Banknote,
  },
  
  // Семейные документы
  {
    id: "prenup",
    title: "Брачный договор",
    description: "Регулирование имущественных отношений между супругами",
    path: "/brachnyj-dogovor",
    category: "family",
    icon: Heart,
  },
  {
    id: "property-division",
    title: "Соглашение о разделе имущества",
    description: "Раздел совместно нажитого имущества супругов при разводе",
    path: "/soglashenie-o-razdele-imushhestva",
    category: "family",
    icon: Scale,
  },
  {
    id: "child-travel",
    title: "Согласие на выезд ребенка",
    description: "Разрешение на выезд несовершеннолетнего ребенка за границу",
    path: "/soglasie-na-vyezd-rebenka",
    category: "family",
    icon: Plane,
  },
  {
    id: "alimony",
    title: "Соглашение об уплате алиментов",
    description: "Договор о содержании ребенка или супруга",
    path: "/soglashenie-ob-alimentah",
    category: "family",
    icon: Baby,
  },
  
  // Для бизнеса
  {
    id: "service-contract",
    title: "Договор оказания услуг",
    description: "Универсальный договор на оказание услуг между ИП или ООО",
    path: "/dogovor-okazaniya-uslug",
    category: "business",
    icon: Handshake,
  },
  {
    id: "work-contract",
    title: "Договор подряда",
    description: "Договор на выполнение работ с конкретным результатом",
    path: "/dogovor-podryada",
    category: "business",
    icon: Hammer,
  },
  {
    id: "supply-contract",
    title: "Договор поставки",
    description: "Договор на поставку товаров для бизнеса",
    path: "/dogovor-postavki",
    category: "business",
    icon: Package,
  },
  {
    id: "employment",
    title: "Трудовой договор",
    description: "Догово�� между работником и работодателем",
    path: "/trudovoj-dogovor",
    category: "business",
    icon: FileSignature,
  },
  {
    id: "work-acceptance",
    title: "Акт выполненных работ",
    description: "Подтверждение выполнения работ по договору",
    path: "/akt-vypolnennyh-rabot",
    category: "business",
    icon: ClipboardCheck,
  },
];

const categories = [
  { id: "civil", name: "Гражданские сделки", icon: FileText },
  { id: "family", name: "Семейные", icon: Users },
  { id: "business", name: "Для бизнеса", icon: Briefcase },
];

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { user, userProfile } = useAuth();

  return (
    <>
      <SEO
        title="Документатор — Создать договор онлайн за 5 минут | Бесплатный конструктор документов"
        description="Создайте договор аренды квартиры, расписку, договор купли-продажи автомобиля онлайн за 5 минут. Простой конструктор юридических документов. Скачайте готовый документ в Word или PDF бесплатно."
        keywords="договор аренды квартиры скачать, договор купли продажи автомобиля, расписка в получении денег, договор займа, создать договор онлайн, юридические документы онлайн, конструктор документов"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Документатор</h1>
              </div>
              <nav className="flex items-center gap-4">
                <a href="#documents" className="text-gray-600 hover:text-gray-900">Документы</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900">О сервисе</a>
                <Link to="/pricing">
                  <Button variant="ghost">Тарифы</Button>
                </Link>
                {user ? (
                  <Link to="/dashboard">
                    <Button>
                      <User className="w-4 h-4 mr-2" />
                      Личный кабинет
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button>
                      <LogIn className="w-4 h-4 mr-2" />
                      Войти
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Быстро • Просто • Надёжно
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Создайте юридический документ за 3 минуты
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Без юристов, без ошибок, без сложностей
            </p>
            
            {/* Search */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Найти документ..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Документов создано</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">3 мин</div>
                <div className="text-gray-600">Среднее время</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Актуальность шаблонов</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 px-4 bg-white/50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-full transition-all ${
                  !selectedCategory
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Все документы
              </button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Documents Grid */}
        <section id="documents" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredDocuments.map((doc) => {
                const DocIcon = doc.icon;
                const isDisabled = doc.comingSoon;
                
                const CardWrapper = isDisabled ? 'div' : Link;
                const cardProps = isDisabled ? {} : { to: doc.path };
                
                return (
                  <CardWrapper key={doc.id} {...cardProps}>
                    <Card className={`h-full transition-all ${
                      isDisabled 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                    } group relative`}>
                      {isDisabled && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-orange-100 text-orange-700">Скоро</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className={`p-3 rounded-lg transition-colors ${
                            isDisabled
                              ? 'bg-gray-100'
                              : 'bg-blue-100 group-hover:bg-blue-600'
                          }`}>
                            <DocIcon className={`w-6 h-6 transition-colors ${
                              isDisabled
                                ? 'text-gray-400'
                                : 'text-blue-600 group-hover:text-white'
                            }`} />
                          </div>
                          {doc.popular && !isDisabled && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              ⭐ Популярный
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{doc.title}</CardTitle>
                        <CardDescription className="text-base">{doc.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {isDisabled ? 'В разработке' : '3-5 минут'}
                          </span>
                          {!isDisabled && (
                            <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                              Создать →
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CardWrapper>
                );
              })}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Документы не найдены. Попробуйте изменить запрос.</p>
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-center mb-12">Как это работает</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="text-xl font-semibold mb-2">Выберите документ</h4>
                <p className="text-gray-600">Из каталога популярных юридических документов</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="text-xl font-semibold mb-2">Ответьте на вопросы</h4>
                <p className="text-gray-600">Простые вопросы вместо сложных юридических формулировок</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="text-xl font-semibold mb-2">Скачайте документ</h4>
                <p className="text-gray-600">Готовый документ в PDF или Word за минуту</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="about" className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-center mb-12">Почему Документатор?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Без юридического образования</h4>
                  <p className="text-gray-600">Понятные вопросы вместо сложных терминов</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Безопасно</h4>
                  <p className="text-gray-600">Без вирусов и подозрительных файлов</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Быстро</h4>
                  <p className="text-gray-600">3-5 минут вместо часов поисков</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Актуально</h4>
                  <p className="text-gray-600">Все шаблоны соответствуют текущим законам РФ</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-6 h-6" />
                  <span className="font-bold text-lg">Документатор</span>
                </div>
                <p className="text-gray-400">
                  Умный конструктор юридических документов для всех
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Документы</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/dogovor-arendy-kvartiry" className="hover:text-white">Договор аренды</a></li>
                  <li><a href="/raspiska-v-poluchenii-deneg" className="hover:text-white">Расписка</a></li>
                  <li><a href="/dogovor-kupli-prodazhi-avto" className="hover:text-white">Купля-продажа авто</a></li>
                  <li><a href="/dogovor-zajma" className="hover:text-white">Договор займа</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Поддержка</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Помощь</a></li>
                  <li><a href="#" className="hover:text-white">Контакты</a></li>
                  <li><Link to="/privacy" className="hover:text-white">Политика конфиденциальности</Link></li>
                  <li><Link to="/terms" className="hover:text-white">Пользовательское соглашение</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p className="mb-2">
                © 2026 Документатор. Все права защищены.
              </p>
              <p className="text-sm">
                ⚠️ Документы носят информационный характер и не являются юридической консультацией. 
                Для сложных ситуаций рекомендуем обратиться к юристу.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}