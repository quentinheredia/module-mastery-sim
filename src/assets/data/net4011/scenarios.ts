export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  caseDescription: string;
  questions: string[];
  keyConcepts: { title: string; content: string }[];
  answer?: string;
}

export const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    title: "Scenario 1: The Coffee Shop",
    subtitle: "Layers of Security & Threats",
    caseDescription:
      "You are working from a coffee shop and need to access your company's network.",
    questions: [
      'According to Chapter 10, what is the inherent danger of this environment, and what specific attack does Chapter 1 warn about regarding public Wi-Fi?',
      'Using the concept of "Defense-in-Depth" (Principle P13), describe two specific layers of security discussed in the text that you should use to protect your data.',
    ],
    keyConcepts: [
      {
        title: "The Threat",
        content:
          'Unencrypted/open wireless links make eavesdropping trivial. There is a risk of a "middle-person scenario" where an attacker configures a laptop as a "rogue wireless access point that accepts and then relays communications".',
      },
      {
        title: "Layer 1 (Host-Based)",
        content:
          "Because you are outside the enterprise perimeter, you need a personal firewall (host-based) running on your end-user machine. This is critical for mobile devices in hotels or coffee shops.",
      },
      {
        title: "Layer 2 (Network-Based)",
        content:
          'You should use an "encrypted tunnel" (like SSH or IPsec) to secure data transiting the untrusted network.',
      },
      {
        title: "Defense-in-Depth",
        content:
          'Explain how Principle P13 dictates building "defenses in multiple layers backing each other up, forcing attackers to defeat independent layers".',
      },
    ],
    answer: `**1. The Threat Environment:** According to Chapter 10, the inherent danger of this environment is that normal TCP/IP packets are transmitted in plaintext. This means the full packet content is visible, and "open wireless links make eavesdropping trivial". Chapter 1 specifically warns that an authorized remote user in a café might fall victim to a "middle-person scenario," where an attacker configures a laptop as a "rogue wireless access point that accepts and then relays communications".

**2. Defense-in-Depth (Principle P13):** The principle of Defense-in-Depth dictates building "defenses in multiple layers backing each other up, forcing attackers to defeat independent layers". Two specific layers to implement here are:

- **Layer 1 (Host-Based Firewall):** Because you are working on an untrusted network "beyond the protection of perimeter firewalls of enterprise networks," you must use a personal (host-based) firewall built into your end-user machine to filter packets directly into and out of your host.

- **Layer 2 (Encrypted Tunnel):** To protect the plaintext data transiting the untrusted Internet, you should use an "encrypted tunnel" (such as SSH or an IPsec VPN). This ensures your data is protected by cryptography while moving across the public channel.`,
  },
  {
    id: "scenario-2",
    title: "Scenario 2: Enterprise Firewall Architecture & Trust Zones",
    subtitle: "Firewall Architecture & Trust Zones",
    caseDescription:
      "Your company is designing a new network and needs to separate the trusted internal network from the untrusted Internet.",
    questions: [
      "Describe the components of the comprehensive firewall architecture (Figure 10.4) discussed in the text.",
      'How do we establish "trust domains" (zones) in this architecture, and how do trust assumptions change depending on whether a user is working from the internal network versus a coffee shop?',
    ],
    keyConcepts: [
      {
        title: "The Architecture",
        content:
          'A comprehensive architecture uses a perimeter network called a "DMZ (demilitarized zone)". It includes an "exterior router" facing the Internet and an "interior router" fronting the internal network.',
      },
      {
        title: "The Bastion Host",
        content:
          'Inside the DMZ is a "bastion host" which acts as the contact point for inbound connections. It is a defensive host exposed to the hostile network and must be hardened.',
      },
      {
        title: "Trust Domains",
        content:
          'Gateways and communications links are used to "delimit what might informally be called trust domains". Areas inside the internal network have different "trust assumptions" (e.g., users are authenticated) compared to the untrusted Internet.',
      },
    ],
    answer: `**1. Architecture Components:** A comprehensive enterprise firewall architecture uses a perimeter network known as a "network DMZ (demilitarized zone)". This zone acts as an outer layer between the hostile external network and the internal network. The architecture includes an "exterior router" (screening router) facing the Internet and an "interior router" fronting the internal network. Positioned within the DMZ is a "bastion host," which serves as the "contact point for inbound connections, and the gateway proxy for outbound connections".

**2. Establishing Trust Domains:** Trust domains are established by identifying system gateways (like firewalls) that filter communications to "delimit what might informally be called trust domains". Trust assumptions change drastically based on location:

- **Internal Network:** This area is often assumed to be secure, with a trust assumption that "users within this boundary are authenticated, or data within this boundary has passed through a filter".

- **Coffee Shop (External/Untrusted):** An external network is considered "insecure" and hostile. Users connecting from outside the perimeter cannot rely on the firewall for protection and must use technologies like VPNs to securely bridge their connection into the trusted internal network.`,
  },
  {
    id: "scenario-3",
    title: "Scenario 3: Budget, Assets, and Security Policy",
    subtitle: "Security Policy & Cost-Benefit Analysis",
    caseDescription:
      "You are the security architect for a startup with a very tight IT budget. You need to draft a security policy to protect your company's proprietary software code.",
    questions: [
      "Before drafting the policy or buying equipment, what fundamental questions must you ask about your assets and risks?",
      "How does a cost-benefit analysis dictate what security mechanisms you actually implement?",
    ],
    keyConcepts: [
      {
        title: "Defining the Policy",
        content:
          'A security policy "specifies the design intent of a system\'s rules and practices—what is, and is not (supposed to be) allowed".',
      },
      {
        title: "Asset Evaluation",
        content:
          'You must ask, "What assets are most valuable, and what are their values?".',
      },
      {
        title: "Budgeting via Risk Assessment",
        content:
          'You use qualitative risk assessment to rank threats, which dictates which assets "should receive attention ahead of others, given a limited computer security budget".',
      },
      {
        title: "Cost-Benefit",
        content:
          'If the "total cost of a new defense exceeds the anticipated benefits" (like lower expected losses), then the defense is "unjustifiable from a cost-benefit analysis viewpoint".',
      },
    ],
    answer: `**1. Fundamental Risk Assessment Questions:** Before drafting a policy, you must evaluate the risk by asking several fundamental questions:

- "What assets are most valuable, and what are their values?"
- "What system vulnerabilities exist?"
- "What are the relevant threat agents and attack vectors?"
- "What are the associated estimates of attack probabilities, or frequencies?"

**2. Cost-Benefit Analysis and Implementation:** A security policy defines "what is, and is not (supposed to be) allowed". However, implementing the controls to enforce this policy requires a cost-benefit analysis. If the "total cost of a new defense exceeds the anticipated benefits," the defense is "unjustifiable from a cost-benefit analysis viewpoint". Because the startup has a limited budget, you must use qualitative risk assessment to compare and rank risks. This ranked list dictates which assets "should receive attention ahead of others, given a limited computer security budget," ensuring you implement the most cost-effective measures to protect the proprietary code.`,
  },
];
