import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { USER_TYPES } from '@/constants/user';
import { Download, BookOpen, DollarSign, Users, GraduationCap, MessageSquare, BarChart3, Star, Apple, Play, Cloud, Droplets, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WeatherData {
  current: {
    temperature: string;
    location: string;
    humidity: string;
    wind: string;
    status: string;
  };
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(
              `https://getweatherbycityapi.laziestant.tech/v2/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await res.json();
            setWeather(data);
          } catch (error) {
            console.error('Failed to fetch weather:', error);
          }
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, [isAuthenticated]);

  const handleDownload = (id: string, url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] to-[#f0f9ff]">
      {/* Weather Section */}
      {isAuthenticated && weather && (
        <div className="bg-gradient-to-r from-[#53B154] to-[#4FC3F7] text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Cloud className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{weather.current.temperature}°{weather.current.unit || 'C'}</div>
                  <div className="text-sm opacity-90">{weather.current.status}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  <span>{weather.current.humidity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  <span>{weather.current.wind}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section - Full Height with Centered Items */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#53B154]/5 via-white to-[#4FC3F7]/5 flex items-center py-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="relative container mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-[#53B154] to-[#4FC3F7] text-white border-0 px-4 py-2">
                  🌾 Agricultural Knowledge Platform
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-[#53B154] to-[#4FC3F7] bg-clip-text text-transparent">
                    AyarFarm
                  </span>
                  <span className="text-[#1A355E]"> Link</span>
                  <br />
                  <span className="text-[#1A355E]">MSME</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  Access expert farming knowledge, daily market prices, and
                  connect with the farming community - all in one comprehensive
                  mobile app.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to={user?.user_type === USER_TYPES.ADMIN ? '/admin' : '/profile'}>
                    <Button size="lg" className="bg-gradient-to-r from-[#53B154] to-[#4FC3F7] hover:from-[#388e3c] hover:to-[#0288d1] text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="bg-gradient-to-r from-[#53B154] to-[#4FC3F7] hover:from-[#388e3c] hover:to-[#0288d1] text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                    <Download className="mr-2 h-6 w-6" />
                    Download Free App
                  </Button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#53B154]">50K+</div>
                  <div className="text-sm text-gray-500">Happy Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#53B154]">4.9★</div>
                  <div className="text-sm text-gray-500">App Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#53B154]">100+</div>
                  <div className="text-sm text-gray-500">Countries</div>
                </div>
              </div>
            </div>

            {/* Hero Video Demo */}
            <div className="relative flex items-center justify-center">
              <div className="relative bg-gradient-to-br from-[#53B154]/10 to-[#4FC3F7]/10 rounded-3xl p-6 shadow-2xl w-full max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl p-4">
                  <div className="aspect-video bg-black/10 rounded-xl overflow-hidden relative">
                    <img src="/AyarFarm.png" alt="AyarFarm" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#53B154]/10 via-transparent to-[#4FC3F7]/10 pointer-events-none rounded-xl"></div>
                  </div>

                  {/* Video Stats Below */}
                  <div className="grid grid-cols-2 gap-4 mt-4 px-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#53B154]">
                        1000+
                      </div>
                      <div className="text-xs text-gray-500">
                        Knowledge Articles
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#53B154]">
                        500+
                      </div>
                      <div className="text-xs text-gray-500">
                        Daily Price Updates
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FDFF00] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Star className="w-8 h-8 text-[#1A355E]" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#4FC3F7] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-[#53B154]/10 text-[#53B154] border-[#53B154]/20">
              Why Choose AyarFarm?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A355E]">
              Essential Tools for Modern Farmers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access agricultural knowledge, market information, and community
              support to improve your farming practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Expert Knowledge Base",
                description:
                  "Access comprehensive farming guides, best practices, and expert tutorials",
                color: "from-[#53B154] to-[#388e3c]",
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Daily Market Prices",
                description:
                  "Stay updated with current market prices for crops and agricultural products",
                color: "from-[#4FC3F7] to-[#0288d1]",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Farming Community",
                description:
                  "Connect with fellow farmers and share experiences and knowledge",
                color: "from-[#FDFF00] to-[#f9a825]",
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "Educational Content",
                description:
                  "Learn new farming techniques through articles, videos, and tutorials",
                color: "from-[#53B154] to-[#4FC3F7]",
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Q&A Forum",
                description:
                  "Ask questions and get answers from agricultural experts",
                color: "from-[#4FC3F7] to-[#53B154]",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Market Trends",
                description:
                  "Track price trends and make informed selling decisions",
                color: "from-[#FDFF00] to-[#53B154]",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg"
              >
                <CardHeader className="text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-[#1A355E] group-hover:text-[#53B154] transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Updated */}
      <section className="py-20 bg-gradient-to-br from-[#f8fffe] to-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-[#53B154]/10 text-[#53B154] border-[#53B154]/20">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A355E]">
              Trusted by Farmers Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Vegetable Farmer, California",
                content:
                  "AyarFarm's daily price updates help me decide the best time to sell my crops. The knowledge base has improved my farming techniques significantly.",
                rating: 5,
              },
              {
                name: "Miguel Rodriguez",
                role: "Crop Farmer, Mexico",
                content:
                  "The community forum is amazing! I've learned so much from other farmers' experiences and the expert advice shared on the platform.",
                rating: 5,
              },
              {
                name: "Dr. Priya Patel",
                role: "Agricultural Educator, India",
                content:
                  "I recommend AyarFarm to all my students. The educational content is comprehensive and the market data is very reliable.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#FDFF00] fill-current"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#53B154] to-[#4FC3F7] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A355E]">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-[#53B154] via-[#4FC3F7] to-[#53B154] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Start Your Smart Farming Journey Today
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of farmers who access daily market prices, expert
              knowledge, and community support through AyarFarm.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              {isAuthenticated ? (
                <Link to={user?.user_type === USER_TYPES.ADMIN ? '/admin' : '/profile'}>
                  <Button size="lg" className="bg-white text-[#53B154] hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-[#53B154] hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <Apple className="mr-3 h-6 w-6" />
                      Download for iOS
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" className="bg-[#1A355E] text-white hover:bg-[#1A355E]/90 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <Play className="mr-3 h-6 w-6" />
                      Get on Google Play
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="pt-8 text-white/80">
              <p className="text-sm">
                Free download • Expert knowledge • Daily price updates •
                Community support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modern Design */}
      <footer className="bg-[#1A355E] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A355E] to-[#0d1b2a]"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  <span className="text-[#53B154]">Ayar</span>
                  <span className="text-[#FDFF00]">Farm</span>
                </h3>
                <p className="text-blue-100 leading-relaxed max-w-md">
                  Connecting farmers with knowledge, market information, and
                  community support for sustainable agriculture.
                </p>
              </div>

              <div className="flex space-x-4">
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
                  (social) => (
                    <div
                      key={social}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <div className="w-5 h-5 bg-white/60 rounded"></div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-[#53B154] text-lg">
                Features
              </h4>
              <ul className="space-y-3 text-blue-100">
                <li className="hover:text-white cursor-pointer transition-colors">
                  Knowledge Base
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Daily Prices
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Community Forum
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Mobile App
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-[#53B154] text-lg">
                Resources
              </h4>
              <ul className="space-y-3 text-blue-100">
                <li className="hover:text-white cursor-pointer transition-colors">
                  Farming Guides
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Market Reports
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Help Center
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Video Tutorials
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-[#53B154] text-lg">
                Company
              </h4>
              <ul className="space-y-3 text-blue-100">
                <li className="hover:text-white cursor-pointer transition-colors">
                  About Us
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Contact
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              &copy; 2025 AyarFarm. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-blue-200">
              <span className="hover:text-white cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
