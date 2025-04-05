import type { UrlCardProps } from "@/components/url-card"

interface MockData {
  categories: Record<string, UrlCardProps[]>
}

export const mockData: MockData = {
  categories: {
    Technology: [
      {
        title: "The Future of AI: What's Next for Machine Learning",
        url: "https://example.com/ai-future",
        category: "Technology",
        summary: [
          "Transformer models continue to dominate the AI landscape",
          "Multimodal AI systems that combine text, vision, and audio are emerging",
          "Edge AI is bringing machine learning capabilities to resource-constrained devices",
          "AI regulation and ethics becoming central to development processes",
          "Specialized AI hardware accelerators are driving efficiency improvements",
        ],
      },
      {
        title: "Web Development Trends for 2025",
        url: "https://example.com/web-dev-2025",
        category: "Technology",
        summary: [
          "WebAssembly adoption accelerating for performance-critical applications",
          "Micro-frontends architecture gaining popularity in enterprise applications",
          "Server components becoming standard in modern frameworks",
          "CSS container queries enabling more flexible responsive designs",
          "Edge computing shifting more logic to CDN edge networks",
        ],
      },
      {
        title: "Quantum Computing: Practical Applications Emerging",
        url: "https://example.com/quantum-computing",
        category: "Technology",
        summary: [
          "Error correction techniques making quantum systems more reliable",
          "Financial sector implementing quantum algorithms for portfolio optimization",
          "Drug discovery accelerated through quantum simulation of molecular structures",
          "Hybrid classical-quantum approaches showing practical benefits",
          "Cloud providers expanding quantum computing as a service offerings",
        ],
      },
    ],
    Science: [
      {
        title: "Breakthrough in Renewable Energy Storage",
        url: "https://example.com/energy-storage",
        category: "Science",
        summary: [
          "New solid-state battery technology achieves 450Wh/kg energy density",
          "Materials use abundant elements, avoiding rare earth metal dependencies",
          "Demonstrated 5000+ charge cycles with minimal capacity degradation",
          "Operating temperature range expanded to -20°C to 60°C",
          "Manufacturing process compatible with existing production lines",
        ],
      },
      {
        title: "CRISPR Gene Editing Advances Treatment for Rare Diseases",
        url: "https://example.com/crispr-advances",
        category: "Science",
        summary: [
          "Clinical trials show 85% efficacy in treating sickle cell disease",
          "New delivery mechanisms improve cellular targeting precision",
          "Off-target effects reduced to below detectable levels",
          "Single treatment showing durable results over 3+ year follow-up",
          "Regulatory frameworks evolving to accommodate gene editing therapies",
        ],
      },
    ],
    Business: [
      {
        title: "Remote Work Reshaping Corporate Real Estate",
        url: "https://example.com/remote-work-real-estate",
        category: "Business",
        summary: [
          "Major corporations reducing office footprint by average of 30%",
          "Hub-and-spoke model replacing centralized headquarters",
          "Flexible workspace providers seeing 45% growth year-over-year",
          "Commercial real estate values in urban centers down 15-20%",
          "Companies investing savings into employee home office stipends",
        ],
      },
      {
        title: "Supply Chain Resilience Strategies Post-Pandemic",
        url: "https://example.com/supply-chain-resilience",
        category: "Business",
        summary: [
          "Nearshoring becoming preferred strategy over pure cost optimization",
          "Digital twins enabling better supply chain visibility and simulation",
          "Inventory strategies shifting from just-in-time to strategic buffering",
          "Blockchain adoption increasing for supply chain transparency",
          "AI forecasting reducing demand planning errors by up to 30%",
        ],
      },
    ],
    Health: [
      {
        title: "Microbiome Research Reveals Gut-Brain Connection",
        url: "https://example.com/microbiome-brain",
        category: "Health",
        summary: [
          "Specific gut bacteria strains linked to reduced anxiety and depression",
          "Dietary interventions showing promise as mental health adjunct therapies",
          "Vagus nerve identified as primary communication pathway",
          "Inflammatory markers correlate with microbiome composition changes",
          "Clinical trials of targeted probiotics for mental health underway",
        ],
      },
    ],
    Ideas: [
      {
        title: "The Four-Day Workweek: Results from Global Experiments",
        url: "https://example.com/four-day-workweek",
        category: "Ideas",
        summary: [
          "Productivity increased by 8% on average across participating companies",
          "Employee wellbeing scores improved by 32% with reduced burnout",
          "Carbon footprint reduced through decreased commuting and office usage",
          "Retention rates improved by 15% compared to industry averages",
          "Implementation challenges varied significantly by industry and role type",
        ],
      },
    ],
  },
}

