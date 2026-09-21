import '../App.css';
import NavBar from '../components/NavBar';
import React from 'react';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="pt-16 relative" id="mainPic">
        {/* <img src="https://i.pinimg.com/736x/36/d7/0a/36d70ab2a9527f9382601ae73f8b6310.jpg" alt="Background" className="w-full h-screen object-cover" /> */}
        <video src="./homepageVid.mp4" alt="Background" className="w-full h-screen object-cover absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/40 pointer-events-none" autoPlay muted loop playsInline ></video>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-white text-8xl font-bold z-10 text-center">Your Crew’s Shield <br />Against Phishing</h1>
          <button onClick={() => navigate('/signUp')} class="bg-white hover:bg-[#CDCDCD] text-black font-bold py-5 px-5 rounded mt-5 p-4">Sign Up</button>
        </div>
      </div> 

     

      <header className="flex flex-row px-6 text-center items-center justify-center text-neutral-400 py-8">
        <div className="w-1/3">
            <h1 className="text-sm">Trusted by employers who refuse to <br /> leave security to chance. </h1>
        </div>

        <div className="flex flex-row mt-5 w-2/3 -ml-5 gap-5">
          <div className="flex flex-row px-0 py-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <h1 className="text-xl ml-2">500+ Phishing Test <br /> Cases</h1>
          </div>
          
          <div className="flex flex-row whitespace-nowrap gap-0 ml-5">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            <h1 className="text-xl">Supports up to 500 <br /> Employees</h1>
          </div>
          
          <div className="flex flex-row px-0 py-0 ml-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>

            <h1 className="text-xl ml-2">92% Raise Awareness <br />after Training</h1>
          </div>
          
        </div>
      </header>

    <div className="flex flex-col text-center items-center justify-center mt-4">
        <p className="mt-2 text-3xl w-3/4"> We provide cutting-edge Security Awareness Training designed to educate and empower every member of our team, <span className="mt-2 text-3xl text-neutral-400">ensuring our airline and passengers remain fully protected from phishing attacks and other cyber threats.</span></p> 
    </div>
      


       <main className="w-full bg-neutral-100 mt-10 p-5">
          <div className="flex items-center min-h-[60vh] px-16">
            <div className="w-1/2 flex justify-center">
              <img
                src="https://i.pinimg.com/1200x/1a/9e/44/1a9e44af834af4fe0bab74348a68ddaa.jpg"
                alt=""
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="w-1/2 flex flex-col justify-center ml-10 py-8">
        
              <p className="text-gray-700 text-2xl leading-relaxed h-full font-extralight">
                Phishing is one of the top entry points for cybersecurity breaches. Airline employees are particularly
                vulnerable because attackers can attempt to gain sensitive information, impersonate staff, or access
                critical operational systems. Understanding phishing tactics is key to keeping both employees and
                passengers safe.
              </p>

              <button className='mt-10 hover:bg-neutral-300 p-4 ' onClick={() => navigate('/resources')}>More Resources </button>
            </div>
          </div>
        </main>


        <div className='flex flex-col mt-20'>
          <h1 className='text-3xl mb-2 ml-36'>How we protect You</h1>
          <p className='mb-10 ml-36 text-neutral-400'>Discover how our platform strengthens your organization’s security with intuitive, effective  <br /> tools designed to keep your team and data safe.</p>

        <div className="w-full flex flex-row justify-center items-start -mx-4">

          <div className="w-5/25 px-4 mb-8">
            <div className="relative rounded overflow-hidden shadow-lg h-64 group">
              <img 
                src="https://i.pinimg.com/1200x/71/04/12/71041245915beabcb7a6ca26430a6f6d.jpg" 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end items-center bg-black/25 hover:bg-black/50 text-white px-4 text-center">
                <p className=" text-lg font-bold mb-1 mt-10 group-hover:opacity-0 transition-opacity duration-300">
                  Spot Phishing Instantly
                </p>

                <p className="text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                  Empower your employees to quickly recognize suspicious emails and messages before they become a threat. Reduce risk with training that makes spotting phishing second nature.
                </p>
              </div>
            </div>
          </div>

          <div className="w-5/25 px-4 mb-8">
            <div className="relative rounded overflow-hidden shadow-lg h-64 group">
              <img 
                src="https://i.pinimg.com/1200x/18/99/5f/18995feaf5667f88e0653cc63330bb45.jpg" 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end items-center bg-black/25 hover:bg-black/50 text-white px-4 text-center">
                <p className=" text-lg font-bold mb-1 mt-10 group-hover:opacity-0 transition-opacity duration-300">
                  Secure Every Account
                </p>

                <p className="text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                  Protect every employee account from unauthorized access. With our proactive guidance and tools, you can prevent breaches and keep your company’s systems safe.
                </p>
              </div>
            </div>
          </div>


          <div className="w-5/25 px-4 mb-8">
            <div className="relative rounded overflow-hidden shadow-lg h-64 group">
              <img 
                src="https://i.pinimg.com/1200x/2e/74/89/2e7489efd25649724c19e35a14df784a.jpg" 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end items-center bg-black/25 hover:bg-black/50 text-white px-4 text-center">
                <p className=" text-lg font-bold mb-1 mt-10 group-hover:opacity-0 transition-opacity duration-300">
                  Safeguard Critical Data
                </p>

                <p className="text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                  Ensure passenger information and company operations remain secure. Our platform teaches actionable strategies to prevent data leaks and operational disruptions.
                </p>
              </div>
            </div>
          </div>


          <div className="w-5/25 px-4 mb-8">
            <div className="relative rounded overflow-hidden shadow-lg h-64 group">
              <img 
                src="https://i.pinimg.com/736x/a9/f7/54/a9f754464eb447566a848b003ae13883.jpg" 
                alt="" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end items-center bg-black/25 hover:bg-black/50 text-white px-4 text-center">
                <p className=" text-lg font-bold mb-1 mt-10 group-hover:opacity-0 transition-opacity duration-300">
                  Act Fast
                </p>

                <p className="text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                  Respond effectively to phishing attempts. Learn proper reporting procedures, containment strategies, and how to minimize impact.
                </p>
              </div>
            </div>
          </div>

        </div>
        
        <p className='mb-10 ml-175 text-neutral-400'>Our goal is to provide comprehensive phishing awareness training to all airline employees. <br /> We simulate phishing attempts in a controlled environment so staff can recognize <br /> malicious messages and respond appropriately. By fostering a culture of vigilance,<br /> we minimize risks and protect sensitive data.</p>
    </div>


      <div className="flex flex-col md:flex-row items-center md:items-start mt-20 mb-20 gap-10 w-full bg-neutral-100 p-20">
        <div className="md:w-1/2 items-center justify-center">
          <h1 className="text-6xl font-extralight mb-6 text-center">Resilience Tracker</h1>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            The CrewPhished dashboard gives employers a clear view of their organization’s phishing readiness by bringing all key metrics together. Click-rate charts show how often employees fall for simulated threats, while ignore-rate data highlights who is consistently identifying suspicious messages. The resilience tracker reveals how awareness improves over time, making it easy to spot trends and areas that need support. Together, these insights help employers strengthen weak points, reinforce good habits, and build a more secure, phishing-resistant workplace.
          </p>
        </div>

        <div className="md:w-1/2">
          <video 
            src="./slay.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full rounded-xl shadow-lg border border-gray-200"
          ></video>
        </div>
      </div>

      

      
                                            
    </div>
  );
}

export default HomePage;
