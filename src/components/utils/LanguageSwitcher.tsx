import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import { 
  Globe, 
  Languages, 
  Check, 
  Info, 
  Zap,
  Sparkles,
  Clock,
  Users
} from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES, Language } from "./LanguageSelector";
import { useTranslationWithParams, formatDate, formatCurrency } from "./TranslationUtils";

interface LanguageSwitcherProps {
  onLanguageChange?: (language: string) => void;
  showWelcomeMessage?: boolean;
  compact?: boolean;
  showProgress?: boolean;
}

export function LanguageSwitcher({ 
  onLanguageChange, 
  showWelcomeMessage = true,
  compact = false,
  showProgress = false 
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage } = useTranslation();
  const { t } = useTranslationWithParams();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const handleLanguageSwitch = async (language: Language) => {
    if (language.code === currentLanguage) return;

    setIsTransitioning(true);
    setTransitionProgress(0);

    // Simulate translation loading with progress
    const progressInterval = setInterval(() => {
      setTransitionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 50);

    // Apply language change
    setTimeout(() => {
      setLanguage(language.code);
      onLanguageChange?.(language.code);
      
      setTransitionProgress(100);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionProgress(0);
      }, 500);
      
      clearInterval(progressInterval);
    }, 600);
  };

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  if (compact) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 min-w-[120px]"
          disabled={isTransitioning}
        >
          <Globe className="h-4 w-4" />
          <span className="flex items-center gap-1">
            <span>{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
          </span>
        </Button>
        
        {isTransitioning && showProgress && (
          <div className="absolute top-full left-0 right-0 mt-1">
            <Progress value={transitionProgress} className="h-1" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Languages className="h-6 w-6" />
          <T>system.selectLanguage</T>
        </CardTitle>
        <CardDescription>
          <T>system.languageDescription</T>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showWelcomeMessage && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <T>system.welcome</T>
            </AlertDescription>
          </Alert>
        )}

        {isTransitioning && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 animate-pulse" />
              <T>system.switching</T>
            </div>
            <Progress value={transitionProgress} className="h-2" />
          </div>
        )}

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid" className="gap-2">
              <Languages className="h-4 w-4" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <Users className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUPPORTED_LANGUAGES.map((language) => (
                <Card 
                  key={language.code}
                  className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                    currentLanguage === language.code 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleLanguageSwitch(language)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-4xl">{language.flag}</div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{language.nativeName}</h3>
                      <p className="text-sm text-muted-foreground">{language.name}</p>
                    </div>
                    
                    {currentLanguage === language.code && (
                      <div className="flex items-center justify-center gap-1">
                        <Check className="h-4 w-4 text-green-600" />
                        <Badge variant="default" className="text-xs">
                          <T>system.active</T>
                        </Badge>
                      </div>
                    )}

                    {language.code !== 'en' && (
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Local
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <div className="space-y-3">
              {SUPPORTED_LANGUAGES.map((language) => (
                <Card 
                  key={language.code}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentLanguage === language.code 
                      ? 'ring-2 ring-primary bg-muted/50' 
                      : ''
                  }`}
                  onClick={() => handleLanguageSwitch(language)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{language.flag}</div>
                        <div>
                          <h4 className="font-medium">{language.nativeName}</h4>
                          <p className="text-sm text-muted-foreground">{language.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {language.code !== 'en' && (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Regional
                          </Badge>
                        )}
                        
                        {currentLanguage === language.code && (
                          <Badge variant="default" className="gap-1">
                            <Check className="h-3 w-3" />
                            <T>system.current</T>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            <T>system.currentLanguage</T>: <strong>{currentLang.nativeName}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            <Clock className="h-3 w-3 inline mr-1" />
            <T>system.lastUpdated</T>: {formatDate(new Date(), currentLanguage)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Floating language switcher for persistent access
export function FloatingLanguageSwitcher() {
  const { currentLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  
  const handleLanguageChange = (language: Language) => {
    setLanguage(language.code);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="shadow-lg bg-background border-2 hover:scale-105 transition-all"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span>{currentLang.flag}</span>
        </Button>

        {isOpen && (
          <Card className="absolute bottom-full right-0 mb-2 w-48 shadow-xl">
            <CardContent className="p-2">
              <div className="space-y-1">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <Button
                    key={language.code}
                    variant={currentLanguage === language.code ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleLanguageChange(language)}
                    className="w-full justify-start gap-2"
                  >
                    <span>{language.flag}</span>
                    <span>{language.nativeName}</span>
                    {currentLanguage === language.code && (
                      <Check className="h-3 w-3 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Language-specific content showcase
interface LanguageShowcaseProps {
  className?: string;
}

export function LanguageShowcase({ className = "" }: LanguageShowcaseProps) {
  const { currentLanguage } = useTranslation();
  const { t } = useTranslationWithParams();

  const showcaseContent = {
    en: {
      greeting: "Welcome to our system",
      description: "Experience seamless border and passport management in your preferred language.",
      features: ["Real-time processing", "Secure document handling", "Multi-language support", "24/7 availability"]
    },
    fr: {
      greeting: "Bienvenue dans notre système",
      description: "Découvrez une gestion des frontières et des passeports sans faille dans votre langue préférée.",
      features: ["Traitement en temps réel", "Gestion sécurisée des documents", "Support multilingue", "Disponibilité 24h/24"]
    },
    sw: {
      greeting: "Karibu kwenye mfumo wetu",
      description: "Furahia usimamizi wa mipaka na pasi bila matatizo katika lugha unayopendelea.",
      features: ["Uchakataji wa wakati halisi", "Ushughulikaji salama wa hati", "Msaada wa lugha nyingi", "Upatikanaji saa 24"]
    },
    rw: {
      greeting: "Murakaza neza muri sisitemu yacu",
      description: "Funga ubunararibonye bwo gucunga imipaka n'amakarita y'ingendo mu rurimi mukunda.",
      features: ["Gutunganya mu gihe nyacyo", "Gucunga inyandiko mu mutekano", "Gufasha indimi nyinshi", "Kuboneka amasaha 24"]
    }
  };

  const content = showcaseContent[currentLanguage as keyof typeof showcaseContent] || showcaseContent.en;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          {content.greeting}
        </CardTitle>
        <CardDescription>
          {content.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">{t('system.features')}:</h4>
            <ul className="space-y-1">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              <T>system.currentLanguage</T>: {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}