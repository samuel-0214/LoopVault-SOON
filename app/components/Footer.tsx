// Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-start space-y-2">
          <div className="text-3xl font-bold">LoopVault</div>
          <div className="border-t border-white w-full my-2" />
          <p className="text-sm">&copy; LoopVault</p>
          <p className="text-sm">Terms of Service</p>
        </div>

        {/* About Us Section */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold mb-4">About Us</h3>
          <ul className="space-y-2">
            <li><a href="#about_section" className="hover:text-gray-300">Mission</a></li>
            <li><a href="#our_team" className="hover:text-gray-300">Team</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold mb-4">Socials</h3>
          <ul className="space-y-2">
            <li><a href="https://x.com/LoopVault_Defi" className="hover:text-gray-300">Twitter</a></li>
          </ul>
        </div>

        {/* Social Section */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="hover:text-gray-300">Telangana,India</li>
            <li className="hover:text-gray-300">Hyderbad,500083</li>
            <li className="hover:text-gray-300">Email : loopvault.defi@gmail.com</li>
            <li className="hover:text-gray-300">Phone : 9874583047</li>
          </ul>
        </div>
      </div>
      {/* Back to top */}
      <div className="border-t border-white mt-8 pt-4 flex justify-between items-center max-w-7xl mx-auto px-4">
        <p className="text-sm">&copy; 2024 LoopVault</p>
        <a href="#top" className="hover:text-gray-300 text-sm">Back to top</a>
      </div>
    </footer>
  );
};

export default Footer;
