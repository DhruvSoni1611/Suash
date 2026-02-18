import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

function BlogPost() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState(new Set());

  const categories = [
    { id: "all", name: "All Questions", count: 24 },
    { id: "booking", name: "Booking & Scheduling", count: 8 },
    { id: "payment", name: "Payment & Pricing", count: 6 },
    { id: "service", name: "Service Quality", count: 5 },
    { id: "support", name: "Support & Help", count: 5 },
  ];

  const faqs = [
    {
      id: 1,
      category: "booking",
      question: "How do I book a service?",
      answer:
        "Booking a service is easy! Simply browse our services, select what you need, choose your preferred date and time, provide your address, and complete the payment. You can book online through our website or mobile app.",
    },
    {
      id: 2,
      category: "booking",
      question: "Can I schedule a service for the same day?",
      answer:
        "Yes! We offer same-day booking for most of our services, subject to availability. You can check available time slots during the booking process.",
    },
    {
      id: 3,
      category: "booking",
      question: "How far in advance can I book?",
      answer:
        "You can book our services up to 30 days in advance. This helps ensure you get your preferred date and time slot.",
    },
    {
      id: 4,
      category: "booking",
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes, you can cancel or reschedule your booking up to 4 hours before the scheduled time without any charges. For cancellations within 4 hours, a small cancellation fee may apply.",
    },
    {
      id: 5,
      category: "payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, net banking, UPI payments, and popular digital wallets. Payment is processed securely through our platform.",
    },
    {
      id: 6,
      category: "payment",
      question: "When do I pay for the service?",
      answer:
        "Payment is collected at the time of booking to confirm your appointment. We use secure payment processing to protect your financial information.",
    },
    {
      id: 7,
      category: "payment",
      question: "Do you offer any discounts or promotions?",
      answer:
        "Yes! We regularly offer promotional discounts, especially for first-time customers and during special occasions. Check our website or subscribe to our newsletter for the latest offers.",
    },
    {
      id: 8,
      category: "payment",
      question: "What if I need additional services during the appointment?",
      answer:
        "If you need additional services during the appointment, our professional will provide you with a quote. You can pay for additional services through our app or directly to the service provider.",
    },
    {
      id: 9,
      category: "service",
      question: "Are your service professionals background-verified?",
      answer:
        "Absolutely! All our service professionals undergo thorough background verification, identity checks, and skill assessments before joining our platform.",
    },
    {
      id: 10,
      category: "service",
      question: "What if I'm not satisfied with the service?",
      answer:
        "We offer a 100% satisfaction guarantee. If you're not happy with the service, please contact us within 24 hours, and we'll arrange for a re-service at no additional cost.",
    },
    {
      id: 11,
      category: "service",
      question: "Do I need to be present during the service?",
      answer:
        "It's not mandatory, but we recommend being available for the initial briefing. Our professionals are fully insured and trusted. You can also track the service progress through our app.",
    },
    {
      id: 12,
      category: "service",
      question: "What cleaning products do you use?",
      answer:
        "We use eco-friendly, non-toxic cleaning products that are safe for your family and pets. All products are carefully selected for effectiveness while being environmentally responsible.",
    },
    {
      id: 13,
      category: "support",
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support through multiple channels: call us, email us, use the in-app chat feature, or visit our help center. Our support team is available 24/7.",
    },
    {
      id: 14,
      category: "support",
      question: "How do I track my service request?",
      answer:
        "You can track your service request in real-time through our website or mobile app. You'll receive notifications about your service professional's arrival time and progress updates.",
    },
    {
      id: 15,
      category: "support",
      question: "What areas do you serve?",
      answer:
        "We currently serve major cities across India including Mumbai, Delhi, Bangalore, Chennai, Pune, and Hyderabad. We're expanding to more cities soon!",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>FAQ - SUASH</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about SUASH home services"
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold font-heading text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services, booking
            process, and more.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200"
              }`}
            >
              {category.name}
              <Badge
                variant="secondary"
                className={`ml-2 ${
                  selectedCategory === category.id
                    ? "bg-emerald-400 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isOpen = openItems.has(faq.id);
              return (
                <Card key={faq.id} className="overflow-hidden">
                  <Collapsible>
                    <CollapsibleTrigger
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="px-6 pb-6 pt-0">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any FAQs matching your search. Try different
              keywords or browse by category.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our friendly customer
              support team is here to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>Call Support</span>
              </a>
              <a
                href="mailto:support@suash.com"
                className="inline-flex items-center justify-center space-x-2 bg-white text-emerald-600 border-2 border-emerald-200 px-6 py-3 rounded-xl font-medium hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
              </a>
              <button className="inline-flex items-center justify-center space-x-2 bg-white text-emerald-600 border-2 border-emerald-200 px-6 py-3 rounded-xl font-medium hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200">
                <MessageSquare className="w-4 h-4" />
                <span>Live Chat</span>
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>Available 24/7 • Average response time: Under 5 minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BlogPost;
