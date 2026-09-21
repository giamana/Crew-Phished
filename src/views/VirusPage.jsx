function VirusPage() {
  return (
    <div className="w-full "> <div className="w-full p-5 bg-neutral-200 flex flex-row items-center justify-center gap-4 border border-neutral-300 rounded-md"> 
        <img src="warning.png" alt="Warning Symbol" className="w-16 h-16" /> 
        <div className="flex flex-col text-center"> 
            <h1 className="text-2xl font-bold">WARNING! Your click has been recorded</h1> 
            <p className="text-neutral-700"> You clicked on a phishing email but luckily this one was only a test. </p> 
            </div> 
        </div>

      <div className="px-4">
        <h1 className="text-3xl font-semibold mt-5">Security Alert: Phishing Click Recorded</h1>
        <p className="mt-3 text-lg text-neutral-700 leading-relaxed">
          Our system detected that you clicked on a simulated phishing email sent as part of our internal cybersecurity awareness program. Your click has been logged for training purposes.<br /><br />
          This is not a punishment—it's an opportunity to strengthen your awareness and learn how to recognize harmful emails before they become a real security threat.
        </p>
      </div>

      <div className="px-4 flex flex-col lg:flex-row gap-8 items-start">
        <img 
          src="https://i.pinimg.com/736x/98/42/df/9842df0b569c38d81f33dd0d6ec66829.jpg" 
          alt="Alert" 
          className="w-[350px] rounded-md shadow"
        />
        <div>
          <h1 className="text-2xl font-bold mb-3">Phishing WARNING Signs</h1>
          <ul className="list-disc ml-6 text-lg text-neutral-700 leading-relaxed">
            <li>Unexpected requests asking you to log in, verify information, or download files.</li>
            <li>Strange sender addresses with extra numbers, letters, or misspellings.</li>
            <li>Urgent phrases such as “Act now!” or “Immediate action required.”</li>
            <li>Links that don’t match the website they claim to lead to — always hover first.</li>
            <li>Typos, odd formatting, or inconsistent grammar.</li>
            <li>Attachments you weren’t expecting, especially ZIPs, PDFs, or documents.</li>
            <li>Warnings or offers that feel too good — or too scary — to be real.</li>
          </ul>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-4">
        <p>
          Your participation in this test helps us improve our organization’s security and protect sensitive information from real threats.
        </p>
        <p>
          If you have questions or want additional cybersecurity training, please reach out to the IT Security Team.
        </p>
        <div className="flex items-center p-4 text-sm text-neutral-900 rounded-md bg-neutral-300 w-1/3" role="alert">
          <svg 
            className="w-4 h-4 mr-2 shrink-0 mt-0.5" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            fill="none" 
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p>
            <span className="font-medium mr-1">Stay alert!</span> 
            Thank you for helping keep our workplace secure.
          </p>
        </div>
      </div>

    </div>
  );
}

export default VirusPage;
