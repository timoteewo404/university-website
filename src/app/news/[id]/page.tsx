import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Share2,
  ArrowLeft,
  Eye,
  Heart,
  BookmarkPlus,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ArrowRight
} from "lucide-react";
import type { Metadata } from "next";

interface RelatedArticle {
  id: string;
  title: string;
  image: string;
  category: string;
}

const newsArticles = {
  "ai-research-grant": {
    id: "ai-research-grant",
    title: "EYECAB International University Secures $50M Research Grant for AI Innovation",
    subtitle: "Landmark funding from World Bank establishes Africa's first comprehensive AI Ethics Research Center",
    author: {
      name: "Dr. Sarah Chen",
      role: "Research Director",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 15, 2025",
    readTime: "8 min read",
    views: "2,847",
    category: "Research",
    tags: ["AI", "Research", "Ethics", "Innovation", "Funding"],
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
    content: `EYECAB International University has received a landmark $50 million research grant from the World Bank to establish Africa's first comprehensive AI Ethics Research Center. This groundbreaking initiative positions the university at the forefront of responsible artificial intelligence development on the continent.

The grant will fund the creation of state-of-the-art research facilities, recruitment of world-class faculty, and development of innovative AI ethics curricula. The center will focus on addressing the unique challenges and opportunities that AI presents for African societies, economies, and governance structures.

The AI Ethics Research Center will concentrate on several critical areas:
• Algorithmic Bias and Fairness: Developing AI systems that are equitable and representative of Africa's diverse populations
• Privacy and Data Governance: Creating frameworks for protecting personal data while enabling innovation
• Economic Impact: Understanding how AI can drive inclusive economic growth across the continent
• Healthcare Applications: Ensuring AI-powered medical solutions are accessible and culturally appropriate

"This grant represents a transformative moment for African technology leadership," said Dr. Sarah Chen, who will direct the new center. "We're not just adopting AI technologies developed elsewhere – we're creating ethical frameworks and solutions that reflect African values and address African challenges."

The center will collaborate with leading universities worldwide while maintaining a distinctly African perspective on AI development. Research partnerships are already being established with MIT, Stanford University, and the University of Oxford.

Students across all disciplines will benefit from this initiative through:
• New AI ethics courses integrated into existing curricula
• Research assistantships and internship programs
• Study abroad opportunities with partner institutions
• Access to cutting-edge AI research facilities and equipment

This initiative is expected to produce graduates who will lead ethical AI development across Africa and beyond. The center aims to publish groundbreaking research, influence global AI policy, and ensure that African voices are central to conversations about the future of artificial intelligence.

The university plans to open the center in early 2026, with the first cohort of AI ethics researchers beginning their work in the fall semester. Applications for research positions and student programs will open in early 2025.`,
    relatedArticles: [
      {
        id: "harvard-partnership",
        title: "Partnership with Harvard Medical School Launches Global Health Initiative",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
        category: "Partnership"
      },
      {
        id: "student-achievements", 
        title: "EYECAB Students Win International Engineering Competition",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
        category: "Achievement"
      }
    ]
  },
  "harvard-partnership": {
    id: "harvard-partnership", 
    title: "Partnership with Harvard Medical School Launches Global Health Initiative",
    subtitle: "Groundbreaking collaboration to address healthcare challenges across Africa",
    author: {
      name: "Prof. Elizabeth Nkomo",
      role: "Dean of Medicine",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 10, 2025",
    readTime: "6 min read",
    views: "1,923",
    category: "Partnership",
    tags: ["Healthcare", "Partnership", "Global Health", "Medical Research"],
    heroImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop",
    content: `EYECAB International University and Harvard Medical School have announced a transformative partnership that will revolutionize healthcare education and research across Africa. This collaboration marks a new era of global health innovation.

The partnership will focus on developing sustainable healthcare solutions, training the next generation of medical professionals, and conducting groundbreaking research into diseases that disproportionately affect African populations.

Key Partnership Areas:
• Medical Education Exchange: Student and faculty exchange programs
• Research Collaboration: Joint research initiatives on tropical diseases  
• Telemedicine Development: Remote healthcare delivery systems
• Public Health Policy: Evidence-based health policy development

"This partnership represents our commitment to global health equity and the power of international collaboration in addressing healthcare challenges," said Prof. Elizabeth Nkomo, Dean of Medicine.

The initiative will begin with a pilot program in 2026, focusing on maternal and child health outcomes across rural African communities.`,
    relatedArticles: [
      {
        id: "ai-research-grant",
        title: "EYECAB Secures $50M Research Grant for AI Innovation", 
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
        category: "Research"
      }
    ]
  },
  "student-achievements": {
    id: "student-achievements",
    title: "EYECAB Students Win International Engineering Competition",
    subtitle: "Engineering team takes first place with sustainable water purification system",
    author: {
      name: "Prof. James Ochieng", 
      role: "Engineering Faculty",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 5, 2025",
    readTime: "4 min read", 
    views: "1,456",
    category: "Achievement",
    tags: ["Engineering", "Innovation", "Students", "Competition", "Sustainability"],
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
    content: `A team of EYECAB engineering students has won first place in the prestigious Global Innovation Challenge with their revolutionary sustainable water purification system. The achievement marks a significant milestone for the university's engineering program.

The winning solution addresses critical water access challenges faced by rural communities across Africa, combining innovative filtration technology with solar power and IoT monitoring systems.

The Innovation:
• Solar-powered filtration using locally sourced materials
• Real-time water quality monitoring via mobile app
• Modular design for easy maintenance and scaling
• Cost-effective solution accessible to rural communities

The team will receive $100,000 in funding to further develop their innovation and implement pilot programs across East Africa.`,
    relatedArticles: [
      {
        id: "ai-research-grant",
        title: "EYECAB Secures $50M Research Grant for AI Innovation",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
        category: "Research"
      }
    ]
  },
  "university-open-house": {
    id: "university-open-house",
    title: "EYECAB International University Open House 2025",
    subtitle: "Join us for our annual Open House event where prospective students can explore our campus, meet faculty, and learn about our innovative programs",
    author: {
      name: "Admissions Office",
      role: "Student Services",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    date: "December 15, 2025",
    readTime: "5 min read",
    views: "3,421",
    category: "Events",
    tags: ["Open House", "Campus", "Admissions", "Student Life"],
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=1200&h=600&fit=crop",
    content: `Join us for our annual Open House event where prospective students can explore our campus, meet faculty, and learn about our innovative programs. Discover how we're shaping the future of education at EYECAB International University.

This comprehensive event will showcase our state-of-the-art facilities, cutting-edge research opportunities, and vibrant campus community. Prospective students and their families will have the opportunity to:

Campus Tours:
• Guided tours of our modern academic buildings
• Visits to specialized laboratories and research centers
• Exploration of student housing and recreational facilities
• Overview of our sustainable campus initiatives

Academic Sessions:
• Meet with faculty from all schools and departments
• Learn about our innovative curriculum and teaching methods
• Discover research opportunities and internship programs
• Information sessions on admissions requirements and scholarships

Student Life Experience:
• Interact with current students and alumni
• Learn about clubs, organizations, and extracurricular activities
• Discover our global exchange programs and partnerships
• Experience our diverse and inclusive campus culture

The event will conclude with a reception where attendees can network with faculty, students, and staff while enjoying refreshments and live entertainment showcasing our vibrant campus culture.`,
    relatedArticles: [
      {
        id: "international-student-orientation",
        title: "International Student Orientation Week",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop",
        category: "Events"
      }
    ]
  },
  "global-education-summit": {
    id: "global-education-summit",
    title: "Global Education Summit: Technology & Innovation",
    subtitle: "Leading experts from around the world will discuss the future of higher education, featuring keynote speakers from top universities and tech companies",
    author: {
      name: "Dr. Michael Thompson",
      role: "Conference Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    date: "January 22-24, 2026",
    readTime: "7 min read",
    views: "2,156",
    category: "Events",
    tags: ["Education", "Technology", "Innovation", "Summit", "Global"],
    heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    content: `Leading experts from around the world will discuss the future of higher education, featuring keynote speakers from top universities and tech companies. Don't miss this opportunity to network with industry leaders and explore the latest trends in educational technology.

The three-day summit will bring together thought leaders, educators, researchers, and technology innovators to explore how digital transformation is reshaping higher education globally.

Day 1: The Digital Transformation of Education
• Keynote: "AI and the Future of Learning" by Dr. Sarah Mitchell, MIT
• Panel: "Virtual Reality in Medical Education"
• Workshop: "Implementing Adaptive Learning Systems"
• Networking Reception

Day 2: Global Partnerships and Innovation
• Keynote: "Building Global Education Networks" by Prof. Liu Wei, Tsinghua University
• Panel: "Cross-Cultural Online Learning Environments"
• Case Study: "EYECAB's International Partnership Success Stories"
• Technology Showcase

Day 3: Sustainability and Accessibility
• Keynote: "Education for Sustainable Development" by Dr. Amina Hassan, UNESCO
• Panel: "Making Quality Education Accessible to All"
• Workshop: "Green Campus Initiatives and Digital Solutions"
• Closing Ceremony and Action Plan

Join us for this groundbreaking event that will shape the future of higher education globally.`,
    relatedArticles: [
      {
        id: "ai-research-grant",
        title: "EYECAB Secures $50M Research Grant for AI Innovation",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
        category: "Research"
      }
    ]
  },
  "international-student-orientation": {
    id: "international-student-orientation",
    title: "International Student Orientation Week",
    subtitle: "A comprehensive orientation program designed specifically for our international students",
    author: {
      name: "International Student Services",
      role: "Student Affairs",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    date: "August 18-22, 2026",
    readTime: "4 min read",
    views: "1,834",
    category: "Events",
    tags: ["International Students", "Orientation", "Cultural Adaptation", "Support"],
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop",
    content: `A comprehensive orientation program designed specifically for our international students. Learn about campus resources, cultural adaptation, and academic success strategies during this week-long immersive experience.

Our International Student Orientation Week is designed to help new international students transition smoothly into life at EYECAB International University and in their new country.

Program Highlights:
• Welcome ceremony with university leadership
• Campus tours and facility orientations
• Immigration and visa information sessions
• Banking and healthcare system guidance
• Cultural adaptation workshops
• Academic success strategies and study skills
• English language support services
• Social activities and community building

Students will also receive their student ID cards, register for courses, and meet with academic advisors to plan their first semester. The week concludes with a cultural celebration featuring food, music, and performances from around the world.

Our dedicated International Student Services team is committed to ensuring every international student feels welcomed, supported, and prepared for academic success at EYECAB.`,
    relatedArticles: [
      {
        id: "university-open-house",
        title: "EYECAB International University Open House 2025",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=300&h=200&fit=crop",
        category: "Events"
      }
    ]
  },
  "quantum-computing-breakthrough": {
    id: "quantum-computing-breakthrough",
    title: "Quantum Computing Breakthrough at EYECAB",
    subtitle: "Our physicists have demonstrated a 3,000 quantum-bit system, clearing a significant hurdle to quantum computing",
    author: {
      name: "Prof. Ahmed Hassan",
      role: "Physics Department Chair",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 20, 2025",
    readTime: "6 min read",
    views: "4,523",
    category: "Research",
    tags: ["Quantum Computing", "Physics", "Breakthrough", "Technology"],
    heroImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop",
    content: `Our physicists have demonstrated a 3,000 quantum-bit system, clearing a significant hurdle to quantum computing. This breakthrough positions EYECAB at the forefront of next-generation technology development.

The quantum computing breakthrough represents years of dedicated research and collaboration between our Physics Department and international partners. This achievement brings us significantly closer to practical quantum computing applications.

Key Technical Achievements:
• Successfully demonstrated a 3,000 qubit system with unprecedented stability
• Achieved quantum coherence times exceeding industry benchmarks
• Developed novel error correction protocols
• Created scalable quantum architecture for future expansion

The research team, led by Prof. Ahmed Hassan, utilized innovative approaches to overcome traditional quantum decoherence challenges. The system maintains quantum states for extended periods, enabling complex calculations previously thought impossible.

Applications and Future Impact:
• Drug discovery and molecular modeling
• Climate change simulations and solutions
• Cryptography and cybersecurity advancement
• Artificial intelligence acceleration
• Financial modeling and optimization

This breakthrough positions EYECAB as a leader in quantum research and opens new opportunities for partnerships with tech giants and research institutions worldwide.`,
    relatedArticles: [
      {
        id: "ai-research-grant",
        title: "EYECAB Secures $50M Research Grant for AI Innovation",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
        category: "Research"
      }
    ]
  },
  "research-symposium-sustainable-development": {
    id: "research-symposium-sustainable-development",
    title: "Research Symposium: Sustainable Development Solutions",
    subtitle: "Annual symposium bringing together researchers, policymakers, and industry leaders to address global sustainability challenges",
    author: {
      name: "Dr. Amara Nkomo",
      role: "Environmental Science Director",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    date: "February 10, 2026",
    readTime: "5 min read",
    views: "2,789",
    category: "Events",
    tags: ["Sustainability", "Research", "Environment", "Development"],
    heroImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=1200&h=600&fit=crop",
    content: `Our annual Research Symposium brings together leading researchers, policymakers, and industry leaders to address the most pressing global sustainability challenges facing our world today.

The symposium will feature groundbreaking research presentations, collaborative workshops, and strategic planning sessions focused on creating actionable solutions for sustainable development.

Research Focus Areas:
• Climate change mitigation and adaptation strategies
• Renewable energy technologies and implementation
• Sustainable agriculture and food security
• Circular economy and waste reduction
• Water resource management and conservation
• Biodiversity preservation and restoration

The event will showcase cutting-edge research from EYECAB faculty and students, alongside presentations from international collaborators and industry partners. Attendees will have opportunities to engage in meaningful dialogue and form new partnerships for future research initiatives.

Expected outcomes include the publication of a comprehensive sustainability action plan and the formation of new international research collaborations focused on achieving the United Nations Sustainable Development Goals.`,
    relatedArticles: [
      {
        id: "environmental-crisis-human-exceptionalism",
        title: "Environmental Crisis: Human Exceptionalism Under Scrutiny",
        image: "https://images.unsplash.com/photo-1569163139402-44bd75d66d4e?w=300&h=200&fit=crop",
        category: "Research"
      }
    ]
  },
  "environmental-crisis-human-exceptionalism": {
    id: "environmental-crisis-human-exceptionalism",
    title: "Environmental Crisis: Human Exceptionalism Under Scrutiny",
    subtitle: "Our environmental researchers argue that overcoming human exceptionalism is key to solving the ecological crisis",
    author: {
      name: "Dr. Amara Nkomo",
      role: "Environmental Science Director",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 18, 2025",
    readTime: "8 min read",
    views: "3,245",
    category: "Research",
    tags: ["Environment", "Philosophy", "Sustainability", "Ethics"],
    heroImage: "https://images.unsplash.com/photo-1569163139402-44bd75d66d4e?w=1200&h=600&fit=crop",
    content: `Our environmental researchers argue that overcoming human exceptionalism is key to solving the ecological crisis. Join the discussion on sustainable development and planetary stewardship in this groundbreaking research initiative.

The concept of human exceptionalism - the belief that humans are fundamentally different from and superior to other species - has long influenced our relationship with the natural world. However, new research from EYECAB's Environmental Science Department suggests this mindset may be a primary barrier to addressing climate change and environmental degradation.

Research Findings:
• Human exceptionalism contributes to unsustainable resource extraction
• Alternative worldviews promote more harmonious human-nature relationships
• Indigenous knowledge systems offer valuable sustainability insights
• Technological solutions alone are insufficient without philosophical shifts

Dr. Amara Nkomo's research team has conducted extensive studies examining how different cultural perspectives on human-nature relationships influence environmental behaviors and policy outcomes.

The Path Forward:
• Integrating indigenous wisdom with modern science
• Developing new frameworks for environmental ethics
• Creating educational programs that emphasize ecological interconnectedness
• Promoting policy changes that recognize natural rights

This research has significant implications for how we approach environmental education, policy development, and international cooperation on climate action.`,
    relatedArticles: [
      {
        id: "research-symposium-sustainable-development",
        title: "Research Symposium: Sustainable Development Solutions",
        image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=300&h=200&fit=crop",
        category: "Events"
      }
    ]
  },
  "cancer-research-younger-adults": {
    id: "cancer-research-younger-adults",
    title: "Cancer Research: Rising Among Younger Adults",
    subtitle: "Our medical researchers are investigating why cancer rates are increasing among younger populations",
    author: {
      name: "Dr. Lisa Chen",
      role: "Medical Research Director",
      avatar: "https://images.unsplash.com/photo-1594824081168-26e1eeb01d8e?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 15, 2025",
    readTime: "6 min read",
    views: "5,234",
    category: "Research",
    tags: ["Cancer Research", "Medical Science", "Health", "Prevention"],
    heroImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=600&fit=crop",
    content: `Our medical researchers are investigating why cancer rates are increasing among younger populations. Join our experts as they explore prevention strategies and early detection methods in this crucial health research.

Recent epidemiological studies have revealed a concerning trend: the incidence of certain cancers among adults under 50 has been steadily increasing over the past three decades. EYECAB's Medical Research Institute is leading groundbreaking research to understand and address this alarming development.

Key Research Areas:
• Environmental factors and exposure patterns
• Lifestyle and dietary influences
• Genetic predisposition and hereditary factors
• Early detection and screening protocols
• Prevention strategies and interventions

Our multidisciplinary research team is collaborating with international medical institutions to identify the root causes of this trend and develop effective prevention and treatment strategies.

Research Findings Include:
• Correlation between processed food consumption and cancer rates
• Impact of environmental toxins on cellular development
• Role of stress and mental health in cancer development
• Effectiveness of early screening programs
• Genetic markers for increased risk assessment

The research has led to the development of new screening protocols specifically designed for younger adults and comprehensive prevention programs that address lifestyle, environmental, and genetic risk factors.`,
    relatedArticles: [
      {
        id: "harvard-partnership",
        title: "Partnership with Harvard Medical School Launches Global Health Initiative",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
        category: "Partnership"
      }
    ]
  },
  "digital-inclusion-seniors": {
    id: "digital-inclusion-seniors",
    title: "Digital Inclusion: Seniors Leading Online Revolution",
    subtitle: "Our research debunks myths about older adults' digital capabilities, showing how seniors are embracing technology",
    author: {
      name: "Prof. James Mitchell",
      role: "Digital Innovation Chair",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 12, 2025",
    readTime: "5 min read",
    views: "2,567",
    category: "Research",
    tags: ["Digital Inclusion", "Technology", "Seniors", "Innovation"],
    heroImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200&h=600&fit=crop",
    content: `Our research debunks myths about older adults' digital capabilities, showing how seniors are embracing technology and contributing to the digital economy in unprecedented ways.

Contrary to common stereotypes, new research from EYECAB's Digital Innovation Institute reveals that adults over 65 are not only adapting to digital technologies but are becoming innovative leaders in various online spaces.

Research Highlights:
• 78% of seniors over 65 now use smartphones regularly
• Senior-led online businesses have grown by 300% in five years
• Older adults show higher engagement rates in online learning
• Social media usage among seniors has increased dramatically
• Technology adoption accelerated significantly during the pandemic

The study, led by Prof. James Mitchell, followed 10,000 adults over 65 across multiple countries to understand their digital behaviors, challenges, and achievements.

Key Findings:
• Seniors prefer video-based learning for new technologies
• Community support networks are crucial for digital adoption
• Privacy and security concerns are primary barriers
• Once comfortable, seniors become highly engaged digital citizens
• Intergenerational tech mentoring benefits all age groups

This research has informed the development of age-inclusive design principles and senior-focused digital literacy programs that are being implemented globally.`,
    relatedArticles: [
      {
        id: "life-enrichment-after-6pm",
        title: "Things to Do After 6 P.M Will Enrich Your Life",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        category: "Lifestyle"
      }
    ]
  },
  "life-enrichment-after-6pm": {
    id: "life-enrichment-after-6pm",
    title: "Things to Do After 6 P.M Will Enrich Your Life",
    subtitle: "Discover evening activities and practices that can transform your personal and professional development",
    author: {
      name: "David Sherof",
      role: "Reporter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    date: "October 8, 2025",
    readTime: "4 min read",
    views: "1,945",
    category: "Lifestyle",
    tags: ["Personal Development", "Evening Activities", "Wellness", "Productivity"],
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    content: `Discover evening activities and practices that can transform your personal and professional development. Research shows that how we spend our evening hours can significantly impact our overall well-being and success.

In our fast-paced world, the hours after 6 P.M. often determine the quality of our lives. Instead of mindlessly scrolling through social media or binge-watching television, consider these enriching activities that can boost your mental health, creativity, and personal growth.

Evening Enrichment Activities:
• Reading for personal and professional development
• Practicing mindfulness and meditation
• Learning new skills through online courses
• Engaging in creative hobbies like writing or art
• Exercising or practicing yoga
• Cooking nutritious meals from scratch
• Connecting with family and friends
• Planning and reflecting on daily achievements

The Science Behind Evening Activities:
Research from EYECAB's Psychology Department shows that purposeful evening activities can improve sleep quality, reduce stress levels, and increase overall life satisfaction. The key is choosing activities that align with your personal goals and values.

Creating Your Evening Routine:
• Start with small, manageable activities
• Set specific times for different activities
• Create a distraction-free environment
• Track your progress and celebrate small wins
• Be consistent but flexible with your routine

Transform your evenings from time wasted to time invested in yourself.`,
    relatedArticles: [
      {
        id: "digital-inclusion-seniors",
        title: "Digital Inclusion: Seniors Leading Online Revolution",
        image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop",
        category: "Research"
      }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = newsArticles[id as keyof typeof newsArticles];

  if (!article) {
    return {
      title: "Article Not Found | EYECAB International University"
    };
  }

  return {
    title: `${article.title} | EYECAB International University`,
    description: article.subtitle,
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = newsArticles[id as keyof typeof newsArticles];

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/news">Back to News</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <section className="py-4 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/news" className="hover:text-red-600">News</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate">Article</span>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative">
        <div className="relative h-96 md:h-[500px]">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Badge className="bg-red-600 text-white mb-4">
                {article.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl">
                {article.title}
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                {article.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                
                {/* Article Meta */}
                <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-4">
                        <Image src={article.author.avatar} alt={article.author.name} width={48} height={48} />
                        <AvatarFallback>{article.author.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
                        <p className="text-sm text-gray-600">{article.author.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 space-x-4">
                      <span className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {article.date}
                      </span>
                      <span className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center text-sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {article.views} views
                      </span>
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Article Body */}
                <div className="prose prose-lg max-w-none mb-12">
                  {article.content.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-6 leading-relaxed text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="hover:bg-red-800 hover:text-white cursor-pointer">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Share Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                  <div className="flex space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-900">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button className="bg-blue-700 hover:bg-blue-800">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>

                {/* Related Articles */}
                {article.relatedArticles && article.relatedArticles.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {article.relatedArticles.map((related: RelatedArticle) => (
                        <Card key={related.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                          <div className="relative">
                            <Image
                              src={related.image}
                              alt={related.title}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                              {related.category}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-red-800 transition-colors">
                              {related.title}
                            </h4>
                            <Button variant="ghost" size="sm" className="p-0 text-red-600 hover:text-red-800">
                              <Link href={`/news/${related.id}`} className="flex items-center">
                                Read More
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Newsletter Signup */}
                <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100">
                  <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest news and updates from EYECAB International University.
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Your email"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm"
                    />
                    <Button className="w-full bg-red-800 hover:bg-red-900">
                      Subscribe
                    </Button>
                  </div>
                </Card>

                {/* Popular Articles */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Popular Articles</h3>
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-sm text-gray-900 mb-1">New Science Complex Opens</h4>
                      <p className="text-xs text-gray-500">Oct 1, 2025 • 3 min read</p>
                    </div>
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Student Achievements in Engineering</h4>
                      <p className="text-xs text-gray-500">Sep 28, 2025 • 2 min read</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Global Health Partnership</h4>
                      <p className="text-xs text-gray-500">Sep 25, 2025 • 4 min read</p>
                    </div>
                  </div>
                </Card>

                {/* Back to News */}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/news">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All News
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
