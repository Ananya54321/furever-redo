"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardTitle, 
  CardDescription, 
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  PawPrint,
  Utensils,
  Scissors,
  Home,
  Phone,
  ArrowRight,
  Clock,
  User,
  Info,
  Camera,
  BarChart,
  Truck,
  Wallet
} from "lucide-react";

export default function StreetAnimalsPage() {
  const emergencyServices = [
    {
      id: 1,
      name: "Injury Reporting",
      description: "Report injured street animals for immediate assistance from nearby volunteers and NGOs",
      image: "https://source.unsplash.com/300x200/?injured,animal",
      icon: <AlertTriangle className="text-red-500" size={24} />,
      color: "bg-red-50",
      link: "/street-animals/report-injury"
    },
    {
      id: 2,
      name: "Deceased Animal Reporting",
      description: "Report deceased animals for proper removal and disposal by municipal authorities",
      image: "https://source.unsplash.com/300x200/?animal,service",
      icon: <Info className="text-gray-500" size={24} />,
      color: "bg-gray-50",
      link: "/street-animals/report-deceased"
    },
    {
      id: 3,
      name: "Food Donation",
      description: "Donate leftover pet-friendly food for street animals through our organized distribution network",
      image: "https://source.unsplash.com/300x200/?dog,food",
      icon: <Utensils className="text-amber-500" size={24} />,
      color: "bg-amber-50",
      link: "/street-animals/donate-food"
    }
  ];

  const mainServices = [
    {
      id: 1,
      name: "Street Dog Management",
      description: "Rehabilitation and relocation services for street dogs that may pose risks in certain areas",
      image: "https://source.unsplash.com/300x200/?street,dog",
      icon: <PawPrint className="text-blue-500" size={24} />,
      link: "/street-animals/management"
    },
    {
      id: 2,
      name: "Sterilization & Vaccination",
      description: "Free sterilization and vaccination drives to control street animal population and prevent diseases",
      image: "https://source.unsplash.com/300x200/?veterinary,vaccination",
      icon: <Scissors className="text-green-500" size={24} />,
      link: "/street-animals/sterilization"
    },
    {
      id: 3,
      name: "Shelter Locator",
      description: "Find nearby shelters and rescue centers where injured or rescued animals can be taken",
      image: "https://source.unsplash.com/300x200/?animal,shelter",
      icon: <MapPin className="text-purple-500" size={24} />,
      link: "/street-animals/shelters"
    },
    {
      id: 4,
      name: "Adoption Program",
      description: "Help street animals find forever homes through our careful adoption matching process",
      image: "https://source.unsplash.com/300x200/?adopt,dog",
      icon: <Home className="text-orange-500" size={24} />,
      link: "/street-animals/adoption"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Mass Vaccination Drive",
      date: "June 15, 2023",
      time: "9:00 AM - 4:00 PM",
      location: "Central Park",
      image: "https://source.unsplash.com/300x200/?vaccination,drive"
    },
    {
      id: 2,
      title: "Street Animal Feeding Day",
      date: "June 22, 2023",
      time: "7:00 AM - 10:00 AM",
      location: "Various City Locations",
      image: "https://source.unsplash.com/300x200/?feeding,animals"
    },
    {
      id: 3,
      title: "Volunteer Training Workshop",
      date: "July 5, 2023",
      time: "10:00 AM - 1:00 PM",
      location: "Community Center",
      image: "https://source.unsplash.com/300x200/?volunteer,training"
    }
  ];

  const statistics = [
    { label: "Animals Helped", value: "12,450+", icon: <Heart className="text-red-500" size={24} /> },
    { label: "Emergency Responses", value: "2,780", icon: <AlertTriangle className="text-amber-500" size={24} /> },
    { label: "Vaccinations", value: "8,925", icon: <Scissors className="text-green-500" size={24} /> },
    { label: "Successful Adoptions", value: "945", icon: <Home className="text-blue-500" size={24} /> }
  ];

  const faqs = [
    {
      question: "How do I report an injured street animal?",
      answer: "Use our mobile app or website to report injured animals. Include a photo, location details, and a brief description of the injury. Our nearest volunteers will be notified immediately."
    },
    {
      question: "What should I do if I find an abandoned puppy?",
      answer: "If safe, provide temporary shelter, food and water. Report it using our app, and we'll help find either a foster home or permanent adoption."
    },
    {
      question: "How can I volunteer for animal welfare activities?",
      answer: "Sign up through our 'Volunteer' section. We offer various roles including emergency response, food distribution, shelter assistance, and administrative help."
    },
    {
      question: "Are the sterilization services free?",
      answer: "Yes, all our sterilization and vaccination services for street animals are completely free of charge. We operate through donations and government support."
    },
    {
      question: "How does the food donation program work?",
      answer: "You can donate unopened pet food or safe leftover food through our collection points. Our volunteers distribute it to street animals in need according to set schedules."
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold titlefont">
                Street Animal Welfare
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Help us create a better world for street animals through compassion, care, and community action.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Report Emergency
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  <PawPrint className="mr-2 h-4 w-4" /> Find Nearby Services
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 w-full rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="https://source.unsplash.com/800x600/?street,dogs,rescue" 
                alt="Street animal rescue"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3 text-primary titlefont">
            Emergency Services
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Immediate assistance for street animals in distress - report incidents quickly for rapid response.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {emergencyServices.map((service) => (
              <Card key={service.id} className="transition-transform hover:scale-[1.02] overflow-hidden border-t-4" style={{ borderTopColor: service.color ? service.color.replace('bg-', '') : 'currentColor' }}>
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className={`${service.color} p-3 rounded-full`}>
                      {service.icon}
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                  <CardDescription className="min-h-[80px]">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href={service.link} className="w-full">
                    <Button className="w-full">
                      Report Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 md:p-5 rounded flex items-start max-w-2xl">
              <Phone className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-800">Emergency Helpline</h3>
                <p className="text-yellow-700">For immediate assistance, call our 24/7 animal emergency helpline: <strong>1-800-ANIMALS</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3 text-primary titlefont">
            Street Animal Welfare Programs
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Comprehensive services to improve the health, safety, and well-being of street animals in our community.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((service) => (
              <Card key={service.id} className="overflow-hidden flex flex-col md:flex-row">
                <div className="relative h-60 md:h-auto md:w-2/5">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6 md:w-3/5">
                  <CardTitle className="text-xl mb-3">{service.name}</CardTitle>
                  <CardDescription className="mb-4">
                    {service.description}
                  </CardDescription>
                  <Link href={service.link}>
                    <Button className="w-full md:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3 text-primary titlefont">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Our streamlined process for street animal welfare reporting and assistance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="text-primary" size={32} />
                </div>
                <div className="absolute top-8 -right-4 hidden md:block">
                  <ArrowRight className="text-primary" size={24} />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">Report</h3>
              <p className="text-muted-foreground">
                Report an injured animal or situation through our app or website
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-primary" size={32} />
                </div>
                <div className="absolute top-8 -right-4 hidden md:block">
                  <ArrowRight className="text-primary" size={24} />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">Locate</h3>
              <p className="text-muted-foreground">
                Nearby volunteers and services are automatically notified
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="text-primary" size={32} />
                </div>
                <div className="absolute top-8 -right-4 hidden md:block">
                  <ArrowRight className="text-primary" size={24} />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">Respond</h3>
              <p className="text-muted-foreground">
                Professional help arrives to assist the animal in need
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Recover</h3>
              <p className="text-muted-foreground">
                Animals receive proper treatment, rehabilitation, and care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-primary titlefont">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="outline" className="flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl">{event.title}</h3>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full">Register</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer & Donate Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 titlefont">
                Become a Volunteer
              </h2>
              <p className="mb-6 opacity-90">
                Join our network of dedicated volunteers who help street animals in various capacities:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <User className="mt-1 flex-shrink-0" size={20} />
                  <span>Emergency response and rescue</span>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="mt-1 flex-shrink-0" size={20} />
                  <span>Food distribution and feeding programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Home className="mt-1 flex-shrink-0" size={20} />
                  <span>Foster care for recovering animals</span>
                </li>
                <li className="flex items-start gap-3">
                  <Camera className="mt-1 flex-shrink-0" size={20} />
                  <span>Awareness campaigns and documentation</span>
                </li>
              </ul>
              <Button className="bg-white text-primary hover:bg-white/90">
                Sign Up as Volunteer
              </Button>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 titlefont">
                Support Our Work
              </h2>
              <p className="mb-6 opacity-90">
                Your donations help us sustain and expand our street animal welfare programs:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Scissors className="mt-1 flex-shrink-0" size={20} />
                  <span>Fund sterilization and vaccination drives</span>
                </li>
                <li className="flex items-start gap-3">
                  <Utensils className="mt-1 flex-shrink-0" size={20} />
                  <span>Purchase food and medical supplies</span>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="mt-1 flex-shrink-0" size={20} />
                  <span>Support emergency rescue operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Home className="mt-1 flex-shrink-0" size={20} />
                  <span>Help maintain animal shelters and facilities</span>
                </li>
              </ul>
              <Button className="bg-white text-primary hover:bg-white/90">
                <Wallet className="mr-2 h-4 w-4" /> Donate Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary titlefont">
            Our Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <BarChart className="text-primary" /> Monthly Impact
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Emergency Responses</span>
                    <span className="text-sm font-medium">248</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Animals Treated</span>
                    <span className="text-sm font-medium">376</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Vaccinations</span>
                    <span className="text-sm font-medium">520</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Sterilizations</span>
                    <span className="text-sm font-medium">184</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <MapPin className="text-primary" /> Areas Covered
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-1">North Region</h4>
                  <div className="text-2xl font-bold text-primary">96%</div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-1">South Region</h4>
                  <div className="text-2xl font-bold text-primary">88%</div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-1">East Region</h4>
                  <div className="text-2xl font-bold text-primary">72%</div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-1">West Region</h4>
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3 text-primary titlefont">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Get answers to common questions about our street animal welfare services.
          </p>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border rounded-lg overflow-hidden bg-white"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span className="ml-6 flex-shrink-0">
                    {expandedFaq === index ? (
                      <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="p-4 pt-0 border-t">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 titlefont">
            Together We Can Make a Difference
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join us in our mission to improve the lives of street animals in our community. Every action counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-accent hover:bg-white/90">
              Report an Animal in Need
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Explore Ways to Help
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 