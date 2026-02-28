export interface Project {
  id: string
  number: string
  title: string
  tag: string
  image: string
  previewWidth: number
  previewHeight: number
  description: string
  role: string
  year: string
  client: string
  overview: string
  challenge: string
  solution: string
  result: string
}

export const projects: Project[] = [
  {
    id: "sybill-credits",
    number: "01",
    title: "Sybill Credits",
    tag: "Pricing & Growth",
    image: "/images/nebula.jpg",
    previewWidth: 600,
    previewHeight: 400,
    description: "Launching a new pricing and gating structure aimed at growth.",
    role: "Product Designer",
    year: "2026",
    client: "Sybill",
    overview:
      "Sybill Credits involved designing a new pricing and gating structure for Sybill's AI-powered sales platform. The system needed to balance monetization goals with user experience to drive sustainable growth.",
    challenge:
      "The existing pricing model was creating friction for new users and limiting expansion revenue. The team needed a credits-based system that felt fair, transparent, and encouraged deeper product adoption.",
    solution:
      "I designed a credits-based pricing architecture with clear usage indicators, smart gating moments, and upgrade paths that felt natural rather than forced. Extensive A/B testing validated each decision point.",
    result:
      "The new pricing structure significantly improved conversion rates and reduced churn, creating a more predictable revenue model while maintaining a positive user experience throughout the product.",
  },
  {
    id: "sybill-tasks",
    number: "02",
    title: "Sybill Tasks",
    tag: "AI Productivity",
    image: "/images/quantum.jpg",
    previewWidth: 500,
    previewHeight: 650,
    description: "Giving time back to teams with a smart to-do list that auto-captures tasks.",
    role: "Product Designer",
    year: "2025",
    client: "Sybill",
    overview:
      "Sybill Tasks is an intelligent task management feature that automatically captures action items from sales meetings and conversations, giving time back to teams by eliminating manual note-taking.",
    challenge:
      "Sales teams were spending significant time manually logging tasks from meetings, leading to missed follow-ups and lost deals. The challenge was designing an AI-powered system that users would trust over their own notes.",
    solution:
      "I designed a smart to-do list that uses AI to auto-capture tasks from conversations, with clear attribution and easy editing. The interface prioritizes transparency in how tasks are detected and confidence scoring.",
    result:
      "Teams using Sybill Tasks reported saving hours per week on manual task entry, with follow-up completion rates improving dramatically. The feature became one of the most-used capabilities in the platform.",
  },
  {
    id: "heymarket-ai",
    number: "03",
    title: "Heymarket AI",
    tag: "AI Agents",
    image: "/images/lumina.jpg",
    previewWidth: 700,
    previewHeight: 450,
    description: "Adding AI Agent capabilities to a business texting platform.",
    role: "Product Designer",
    year: "2025",
    client: "Heymarket",
    overview:
      "Heymarket AI brought intelligent agent capabilities to a business texting platform, enabling automated yet personalized customer interactions at scale through conversational AI.",
    challenge:
      "Businesses needed to respond to customer messages faster without sacrificing the personal touch. The challenge was integrating AI agents that could handle complex conversations while maintaining brand voice.",
    solution:
      "I designed the AI agent configuration and monitoring interface, focusing on transparency and control. Businesses could set guardrails, review AI responses, and seamlessly hand off to human agents when needed.",
    result:
      "The AI agent feature enabled businesses to handle significantly more conversations while maintaining high customer satisfaction scores. Response times dropped dramatically across all supported channels.",
  },
  {
    id: "barty",
    number: "04",
    title: "Barty",
    tag: "0 to 1",
    image: "/images/atlas.jpg",
    previewWidth: 600,
    previewHeight: 400,
    description: "Building a bar booking platform from 0-1.",
    role: "Product Design Engineer",
    year: "2025",
    client: "Barty",
    overview:
      "Barty is a bar booking platform built from the ground up, connecting nightlife venues with customers looking for seamless reservation and table booking experiences.",
    challenge:
      "The nightlife industry lacked a modern, user-friendly booking platform. Existing solutions were fragmented and failed to serve both venue operators and customers effectively in a mobile-first world.",
    solution:
      "I designed and engineered the full product from 0-1, creating intuitive booking flows for customers and powerful management tools for venue operators. The platform was built for speed and reliability during peak hours.",
    result:
      "Barty successfully launched and onboarded multiple venues, providing a streamlined booking experience that reduced no-shows and increased venue revenue through better capacity management.",
  },
]
