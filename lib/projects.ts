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
    id: "credits-and-conversion",
    number: "01",
    title: "Credits and conversion",
    tag: "Sybill.ai",
    image: "/images/sybill-credits.png",
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
    id: "ai-task-manager",
    number: "02",
    title: "AI task manager",
    tag: "Sybill.ai",
    image: "/images/sybill-tasks-meetings.png",
    previewWidth: 600,
    previewHeight: 375,
    description: "Giving time back to teams with a smart to-do list that auto-captures tasks.",
    role: "Product Designer",
    year: "2026",
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
    id: "climbing-gym",
    number: "03",
    title: "Climbing gym app",
    tag: "Touchstone",
    image: "/images/climbing-gym.png",
    previewWidth: 600,
    previewHeight: 400,
    description:
      "My gym’s class booking experience is a mess—so I built a proper app in an afternoon with Stitch, Figma Make, and Cursor.",
    role: "Product Design Engineer",
    year: "2026",
    client: "Touchstone",
    overview:
      "I climb at Touchstone and love it—but booking classes means going to their website. It’s clunky, hard to scan on your phone, and feels like it was built a decade ago. I wanted to see how fast I could ship something better.",
    challenge:
      "The current flow is desktop-first, buried in menus, and doesn’t give you a simple “my pass” or “my classes” experience. Members end up on the same confusing site every time they want to book or check in. No app, no clear membership view—just a rough web experience.",
    solution:
      "I designed and built a mobile-first app in a few hours one Sunday: Stitch for the design, Figma Make to turn it into a React app, and Cursor to wire it up and refine the UI. You get a scannable membership pass, one-tap class browsing and booking, and a clean view of what you’re signed up for—the experience the gym’s website never had.",
    result:
      "A working prototype that proves a better path is possible. QR pass for entry, class list with book/unbook, and a profile view—all in a compact app that fits how people actually use their phones at the gym. No backend or launch yet; this was a weekend experiment to show what “good” could look like.",
  },
  {
    id: "thesis",
    number: "04",
    title: "THESIS — Your Daily Take",
    tag: "Experimental",
    image: "/images/thesis.png",
    previewWidth: 700,
    previewHeight: 450,
    description: "Adding AI Agent capabilities to a business texting platform.",
    role: "Product Designer",
    year: "2026",
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
]
