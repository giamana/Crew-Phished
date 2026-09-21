// AboutPage.jsx
import React from "react";

function AboutPage(){
  return (
    <div className="text-gray-900">
      <div className=" mt-30">
        <h1 className="text-8xl whitespace-nowrap ml-15">ABOUT US</h1>
        <p className="mb-10 ml-175 text-neutral-400">Phishing is one of the top entry points for cybersecurity breaches. Airline employees are particularly vulnerable because attackers can attempt to gain sensitive information, impersonate staff, or access critical operational systems. Understanding phishing tactics is key to keeping both employees and passengers safe.</p>
        <img src="https://i.pinimg.com/1200x/2b/84/89/2b8489041c4ecd78bff10c6ef29dcaf7.jpg" alt="" className="justify-center items-center mx-auto mt-10"/>
      </div>


      <main className="container mx-auto px-6 py-12">
        

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-neutral-400 leading-relaxed">
            Our goal is to provide comprehensive phishing awareness training to all airline employees. We simulate
            phishing attempts in a controlled environment so staff can recognize malicious messages and respond
            appropriately. By fostering a culture of vigilance, we minimize risks and protect sensitive data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Focus Areas</h2>
          <ul className="list-disc list-inside text-neutral-400 space-y-2">
            <li>Recognizing suspicious emails and messages</li>
            <li>Preventing unauthorized access to employee accounts</li>
            <li>Protecting passenger data and company operations</li>
            <li>Responding effectively to phishing attempts</li>
          </ul>
        </section>
      </main>

    </div>
  );
}

export default AboutPage;
