
import React from "react";
import { Outlet } from "react-router-dom";
import Herosection from "../component/Herosection";
import ServicesSection from "../component/Services";
import Testimonials from "./Testimonial";
import WhatsAppPopup from "../form/WhatsAppPopup";

import NotificationUpdates from "./Notification";
import WhyChooseUs from "./WhyChooseUs";
import Auditfile from "../component/Auditfile";



function Home() {
  return (
    <>
<WhatsAppPopup />
      <Herosection />
      <ServicesSection />
      <Auditfile />
      <NotificationUpdates />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}

export default Home;
