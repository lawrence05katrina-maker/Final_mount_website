import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useShrineData } from '../context/ShrineDataContext';
import { Eye, Target, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteContent } = useShrineData();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-center mb-4 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Saint Devasahayam Pillai</h1>
          <p className={`text-center text-green-100 max-w-3xl mx-auto ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            India's First Lay Saint | Martyr of Faith | 1712 - 1752
          </p>
        </div>
      </div>

      {/* Hero Section - A Life of Faith & Courage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className={`md:col-span-1 rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInLeft stagger-1' : 'opacity-0'}`}>
            <img
              src="/about1.png"
              alt="Statue of Saint Devasahayam Pillai"
              className="w-full h-96 object-contain bg-gray-50"
            />
          </div>
          <div className={`md:col-span-2 ${isVisible ? 'animate-slideInRight stagger-2' : 'opacity-0'}`}>
            <h2 className="text-green-800 mb-6">A Life of Faith & Courage</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Born as Neelakanta Pillai into an affluent Hindu Nair family in 1712, Devasahayam Pillai became the first Indian layman to be canonized as a saint by Pope Francis on May 15, 2022. His journey from a palace official to a Christian martyr stands as a testament to unwavering faith and dignity in the face of persecution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Early Life & Conversion */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-green-800 text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Early Life & Conversion</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Neelakandan Pillai was born on April 23, 1712, in Nattalam, Travancore. His father, Vasudevan Namboodiri, was a priest at the Adikesava Perumal Temple in Thiruvattar. Growing up in an influential family with connections to the royal palace of Maharaja Marthanda Varma, young Neelakandan entered palace service and quickly rose to become an official under Ramayyan Dalawa, the Dewan of Travancore.
                </p>
                <Card className="border-green-200 bg-green-100">
                  <CardContent className="pt-6">
                    <h4 className="text-green-800 mb-3 font-semibold">The Turning Point:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      In 1741, after the Battle of Colachel, Dutch commander Captain Eustachius De Lannoy was captured and later became commander of the Travancore army. Through his friendship with De Lannoy, Neelakandan became deeply interested in Christianity. In 1745, he embraced the Christian faith and was baptized as "Lazarus," taking the Malayalam name "Devasahayam" meaning "help of God."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className={`rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
              <img
                src="/about2.jpeg"
                alt="Memorial of Devasahayam Pillai"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline of His Life */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-green-800 text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Timeline of His Life</h2>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className={`rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
            <img
              src="/about3.jpeg"
              alt="Devasahayam Pillai Memorial"
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`space-y-6 ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className="text-green-800 font-bold text-lg mb-2">April 23, 1712</div>
              <p className="text-gray-700">Born as Neelakanta Pillai in Nattalam, Travancore, to an affluent Hindu Nair family</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className="text-green-800 font-bold text-lg mb-2">1741</div>
              <p className="text-gray-700">Battle of Colachel - Dutch forces defeated; De Lannoy becomes friend and spiritual guide</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className="text-green-800 font-bold text-lg mb-2">1745</div>
              <p className="text-gray-700">Converts to Christianity, baptized as Lazarus (Devasahayam) in Vadakkankulam</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className="text-green-800 font-bold text-lg mb-2">1749-1752</div>
              <p className="text-gray-700">Imprisoned for three years, subjected to torture and public humiliation</p>
            </div>
            <div className="border-l-4 border-red-500 pl-6 py-3">
              <div className="text-red-800 font-bold text-lg mb-2">January 14, 1752</div>
              <p className="text-gray-700">Martyred at Aralvaimozhy, shot by soldiers while in deep meditation</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-6 py-3">
              <div className="text-blue-800 font-bold text-lg mb-2">December 2, 2012</div>
              <p className="text-gray-700">Beatified by Pope Benedict XVI - first Indian layman to be beatified</p>
            </div>
            <div className="border-l-4 border-gold-500 pl-6 py-3 border-yellow-500">
              <div className="text-yellow-800 font-bold text-lg mb-2">May 15, 2022</div>
              <p className="text-gray-700">Canonized as Saint by Pope Francis at St. Peter's Square, Vatican City</p>
            </div>
          </div>
        </div>
      </div>

      {/* Persecution & Martyrdom */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-green-800 text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Persecution & Martyrdom</h2>
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className={`md:col-span-2 space-y-4 text-gray-700 leading-relaxed ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
              <p>
                Devasahayam's conversion to Christianity sparked outrage among the Brahmin priests, feudal lords, and members of the royal household. Leaving Hinduism was considered a grave offense, especially for someone of high Nair caste. False charges were brought against him, resulting in his imprisonment for three years.
              </p>
              <p>
                During his captivity, European powers lobbied for his release. Orders were eventually given for him to be exiled. However, the original order was altered, and instead of deportation to Dutch territory, he was taken to Aralvaimozhy border and subjected to brutal torture. His body was painted with red and black spots, and he was forced to sit backward on a water buffalo - a symbol of death in Hindu tradition. Daily, he received eighty stripes, had pepper rubbed into his wounds, and was given only stagnant water to drink.
              </p>
            </div>
            <div className={`md:col-span-1 rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
              <img
                src="/about4.JPG"
                alt="Church at the site of martyrdom"
                className="w-full h-80 object-contain bg-gray-50"
              />
            </div>
          </div>
          <div className={`mt-12 text-center ${isVisible ? 'animate-fadeInUp stagger-4' : 'opacity-0'}`}>
            <Card className="border-green-200 bg-green-50 max-w-4xl mx-auto">
              <CardContent className="pt-6">
                <blockquote className="text-green-800 text-lg italic leading-relaxed">
                  "Water gushed from a rock where he knelt to pray, quenching his thirst in the midst of suffering - a miracle witnessed by many and remembered to this day at Puliyoorkurichi."
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sacred Places & Final Resting Place */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-green-800 text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Sacred Places & Final Resting Place</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
            <img
              src="/about5.JPG"
              alt="St. Francis Xavier's Cathedral"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className={`space-y-4 text-gray-700 leading-relaxed ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
            <p>
              Saint Devasahayam Pillai's tomb in St. Francis Xavier's Cathedral at Kottar, Nagercoil, has become a major pilgrimage site. His body was recovered by local people after his martyrdom and carried to this church, where his mortal remains were interred near the altar.
            </p>
            <p>
              The tomb was restored and beautified after his beatification in 2012. Thousands of devotees visit annually to offer prayers and seek his intercession. His belongings are preserved in a church in Vadakkankulam, exposed every August 15th, the feast of the Assumption of Mary.
            </p>
            <p>
              Key pilgrimage sites include Puliyoorkurichi, where water miraculously gushed from a rock, and Aralvaimozhy, the site of his martyrdom where a church now stands commemorating his sacrifice.
            </p>
          </div>
        </div>
      </div>

      {/* Journey to Sainthood */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-green-800 text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Journey to Sainthood</h2>
          <div className={`max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <p>
              The path to canonization spanned over 270 years. His martyrdom was reported to the Vatican as early as 1756. In 1780, a petition for canonization was submitted. However, it wasn't until 1984 that serious efforts resumed through the initiative of lay persons from the Diocese of Kottar.
            </p>
            <p>
              In 2012, Pope Benedict XVI recognized him as "Venerable" and on December 2, 2012, he was beatified in Nagercoil. Over 100,000 Catholics attended the ceremony. Finally, on February 21, 2020, Pope Francis recognized a miracle attributed to Devasahayam's intercession, clearing the way for his canonization on May 15, 2022.
            </p>
            <Card className="border-green-200 bg-green-100">
              <CardContent className="pt-6">
                <h4 className="text-green-800 mb-3 font-semibold">Historic Achievement:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Saint Devasahayam Pillai is the first Catholic in India who is neither an ordained minister nor a religious to be officially recognized as a saint. His feast day is celebrated on January 14th.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Legacy & Veneration */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-green-800 text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Legacy & Veneration</h2>
        <div className={`max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
          <p>
            He is venerated as the patron saint of India and persecuted Christians worldwide. His life symbolizes the courage to follow one's conscience and faith despite social pressures and persecution. His story inspires believers to stand firm in their convictions while maintaining dignity and compassion.
          </p>
          <p>
            Since the days of the interment of his mortal remains, many Christian pilgrims have visited his tomb and offered prayers. His witness to Christ continues to inspire millions, demonstrating that attentiveness to faith and courage in the face of adversity can leave a lasting legacy for generations.
          </p>
        </div>
        <div className={`mt-12 text-center ${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>
          <Card className="border-green-200 bg-green-50 max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <blockquote className="text-green-800 text-lg italic leading-relaxed mb-4">
                "His witness to Christ is an example of that attentiveness to the coming of Christ. May this holy season help us to centre our lives once more on Christ, our hope."
              </blockquote>
              <cite className="text-green-600 font-medium">- Pope Benedict XVI, December 2, 2012</cite>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vision and Mission */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <Card className={`border-green-200 card-hover ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center animate-float">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-green-800">Our Vision</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {siteContent.vision}
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className={`border-green-200 card-hover ${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-green-800">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {siteContent.mission}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Shrine Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center gap-3 mb-6 ${isVisible ? 'animate-slideInLeft stagger-1' : 'opacity-0'}`}>
            <Heart className="w-8 h-8 text-green-700 animate-pulse-custom" />
            <h2 className="text-green-800">About Our Shrine</h2>
          </div>
          <div className={`space-y-4 text-gray-700 leading-relaxed ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <p>{siteContent.aboutHistory}</p>
            <p>
              The shrine has become a beacon of hope for thousands of pilgrims who visit annually, 
              seeking spiritual renewal, healing, and blessings. Through the intercession of 
              Saint Devasahayam, many have experienced miracles and divine grace.
            </p>
            <p>
              Our shrine continues to grow as a center for evangelization, community service, 
              and spiritual formation, carrying forward the legacy of faith and sacrifice that 
              Saint Devasahayam exemplified.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-green-800 text-center mb-12 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>Our Services & Activities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-green-700">Daily Masses</h4>
                <p className="text-gray-700 text-sm">
                  Holy Mass celebrated daily at 6:00 AM, 9:00 AM, and 6:00 PM
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-3' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-green-700">Pilgrimage Programs</h4>
                <p className="text-gray-700 text-sm">
                  Organized pilgrimage activities and retreat programs throughout the year
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-4' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-green-700">Charitable Works</h4>
                <p className="text-gray-700 text-sm">
                  Educational support, medical aid, and assistance for the underprivileged
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-5' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-green-700">Confession & Counseling</h4>
                <p className="text-gray-700 text-sm">
                  Sacrament of reconciliation and spiritual counseling available
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-6' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-green-700">Feast Day Celebrations</h4>
                <p className="text-gray-700 text-sm">
                  Grand annual celebration on January 14th with special masses and events
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`} style={{animationDelay: '0.7s'}}>
              <CardContent className="pt-6">
                <h4 className="mb-3 text-green-700">Youth Ministry</h4>
                <p className="text-gray-700 text-sm">
                  Engaging programs for youth faith formation and community service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
