function ResourcesPage() {
  return (
    <div className="mt-20 space-y-12 px-4 md:px-20">
      <div className="flex flex-col items-center text-center w-full gap-4 mt-30 mb-20">
        <h1 className="-mb-2">RESOURCES</h1>
        <h1 className="text-4xl font-semibold -mb-2">
          Current Threats & Advances in Cybersecurity
        </h1>
        <span className="text-gray-700 text-lg font-extralight">
          Cyber threats are growing more sophisticated every day, and staying updated is essential.
          <span className="block">
            Learn how the industry is adapting, improving, and preparing for the future of digital safety.
          </span>
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mx-auto">
        <a href="https://thehackernews.com/2025/12/weekly-recap-usb-malware-react2shell.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/1a/5c/b2/1a5cb20a82441f9ec89ca15d0eaf24c1.jpg" alt="USB malware & React2Shell" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">Weekly Recap: USB Malware, React2Shell & More</div>
            <p className="text-gray-700 text-sm">
              A roundup of major cyber‑threats this week — including USB‑based malware, framework flaws and rising attack campaigns. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#malware</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#RCE</span>
          </div>
        </a>

        <a href="https://thehackernews.com/2025/12/cisa-reports-prc-hackers-using.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/1a/ec/22/1aec22d1f38e300e24b6a120af6b10b1.jpg" alt="Brickstorm malware alert" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">PRC Hackers Using BRICKSTORM for Long‑Term Access</div>
            <p className="text-gray-700 text-sm">
              CISA warns that BRICKSTORM, a backdoor targeting VMware & Windows, is being used by state‑sponsored actors to maintain stealthy access. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#backdoor</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#infrastructureSecurity</span>
          </div>
        </a>

        <a href="https://thehackernews.com/2025/12/critical-react2shell-flaw-added-to-cisa.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/55/b9/b0/55b9b01ea653984c0c89e4ad431f2519.jpg" alt="React2Shell vulnerability" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">Critical React2Shell Vulnerability Added to CISA KEV Catalog</div>
            <p className="text-gray-700 text-sm">
              A severe RCE flaw in React Server Components (CVE‑2025‑55182) is now tracked by CISA — update packages immediately. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#React</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#vulnerability</span>
          </div>
        </a>

        <a href="https://thehackernews.com/2025/12/5-threats-that-reshaped-web-security.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/1b/96/3b/1b963b4905d14aa4f6f071832a05b47e.jpg" alt="Web security threats 2025" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">5 Threats That Reshaped Web Security in 2025</div>
            <p className="text-gray-700 text-sm">
              Web‑security trends this year — from AI‑powered attacks to supply‑chain exploitation and growing RCE risk. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#webSecurity</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#threatTrends</span>
          </div>
        </a>

        <a href="https://thehackernews.com/2025/12/android-malware-fvncbot-seedsnatcher.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/e6/33/fc/e633fcf2e992e3f7cd55bfc6935a3312.jpg" alt="Android malware threats 2025" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">New Android Malware Families FvncBot, SeedSnatcher & ClayRat</div>
            <p className="text-gray-700 text-sm">
              Researchers report that FvncBot and SeedSnatcher and an upgraded ClayRat are now targeting mobile devices for data theft and remote control. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#mobileSecurity</span>
            <span className="bg_gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#AndroidMalware</span>
          </div>
        </a>

        

        <a href="https://www.cisa.gov/news-events/news/cisa-launches-industry-engagement-platform-strengthen-industry-engagement-and-collaboration" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/e6/67/71/e66771e76cbd195dc95745c1275ac1cb.jpg" alt="CISA industry engagement" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">CISA Launches Industry Engagement Platform (Dec 2025)</div>
            <p className="text-gray-700 text-sm">
              New platform to strengthen collaboration between government and private‑sector stakeholders on emerging cybersecurity solutions. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#policy</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#cyberCollab</span>
          </div>
        </a>

        <a href="https://thehackernews.com/2025/12/zero-click-agentic-browser-attack-can.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/85/73/2f/85732f89db438176e65d4c9b57b3c957.jpg" alt="Zero-click browser attack" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">Zero‑Click Browser Attack Can Delete Entire Google Drive</div>
            <p className="text-gray-700 text-sm">
              A novel “agentic browser” attack can delete a user’s Google Drive files via a crafted email — no click needed. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#emailSecurity</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#browserAttack</span>
          </div>
        </a>

        <a href="https://thehackernews.com/2025/12/google-patches-107-android-flaws.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/dc/0b/af/dc0bafb52ddc52fef9071dc1204bf6d8.jpg" alt="Android security patch 2025" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">Google Patches 107 Android Vulnerabilities (Dec 2025)</div>
            <p className="text-gray-700 text-sm">
              December’s Android security updates fix a host of vulnerabilities — critical to keep devices safe from exploitation. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#Android</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#securityPatch</span>
          </div>
        </a>

        <a href="https://forbes.com/sites/emilsayegh/2025/12/06/2025-cybersecurity-recap-the-year-systems-broke-setting-up-a-harder-2026/" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/33/16/25/331625b650b4f641f0692481439eecef.jpg" alt="2025 cybersecurity recap" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">2025 Cybersecurity Recap: The Year Systems Broke</div>
            <p className="text-gray-700 text-sm">
              A comprehensive look at why 2025 marked a turning point — with record vulnerability disclosures, nation state campaigns, and stricter compliance landscapes.
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#cybersecurity</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#2025review</span>
          </div>
        </a>

        <a href="https://thehackernews.com/2025/12/android-malware-fvncbot-seedsnatcher.html" className="w-80 rounded-xl overflow-hidden shadow-lg bg-white">
          <img className="w-full h-50 object-cover" src="https://i.pinimg.com/736x/2b/34/25/2b34255a444ddbe7541ef03bd9a04d76.jpg" alt="Mobile security tips" />
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">Mobile Security: Latest Threats & What You Should Know</div>
            <p className="text-gray-700 text-sm">
              Smartphones and tablets remain a major target — these new malware families highlight the need for vigilance. 
            </p>
          </div>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#mobileSecurity</span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">#threats</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default ResourcesPage;
