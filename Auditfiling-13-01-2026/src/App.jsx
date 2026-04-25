// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation,Navigate  } from "react-router-dom";

// Layout & Pages
import Layout from "./layout/Layout.jsx";
import Home from "./page/Home.jsx";
import About from "./page/AboutUs.jsx";
import IncomeTax from "./page/Services/IncomeTax.jsx";
import Gst from "./page/Services/Gst.jsx";
import StartUp from "./page/Services/Startup.jsx";
import Company from "./page/Services/Company.jsx";
import Trademark from "./page/Services/TradeMark.jsx";
import Bankvaluation from "./page/Services/BankValuation.jsx";
import Legal from "./page/Services/Legal.jsx";
import Contact from "./page/ContactPage.jsx";
import PrivacyPolicy from "./page/PrivecyPolicy.jsx";
import TermsAndConditions from "./page/TermCondition.jsx";
import ResellerRegistrationForm from "./reseller/Reseller.jsx";
import ServiceProviderForm from "./page/ServiceProvider/ServiceProvider.jsx";
import LoginForm from "./form/LoginForm.jsx";
import UserProfile from "./UserProfile/UserProfile.jsx";
import CompanyDetail from "./UserProfile/CompanyDatail.jsx";
import CompanyDetailForm from "./UserProfile/ComanyDetailForm.jsx";
import MyRequests from "./UserProfile/MyRequest.jsx";
import CompletedService from "./UserProfile/CompleteService.jsx";
import PaymentHistory from "./UserProfile/PaymentHistory.jsx";
import Feedback from "./UserProfile/Feedback.jsx";
import BlogDetailPage from "./page/Blog/BlogDetails.jsx";
import BlogPage from "./page/Blog/Blog.jsx";
import ProceedToPayment from "./page/Services/document/ProceedToPayment.jsx";
import PaymentSuccess from "./page/Services/document/PaymentSuccess.jsx";
import DocumentUpload from "./page/Services/document/DocumentUpload.jsx";
import ProceedTo from "./page/Services/document/ProceedTo.jsx";
import PartialPayment from "./page/Services/document/PartialPayment.jsx";
import QuickForm from "./form/QuickForm.jsx";
import NotFound from "./page/NotFound.jsx";

// Ad landing pages (without layout)
import GstAds from "./adsForService/GstAds.jsx";
import ItrAds from "./adsForService/ItrAds.jsx";
import StartupAds from "./adsForService/StartupAds.jsx";
import CompanyAds from "./adsForService/CompanayAds.jsx";
import TrademarkAds from "./adsForService/TrademarkAds.jsx";
import LegalAds from "./adsForService/LegalAds.jsx";
import AccountingService from "./page/Services/Accouning service.jsx";
import AccountingTranning from "./page/AccountingTranning/AccountingTranning.jsx";
import MenuMaster from "./component/adminDashboard/pages/MenuMaster.jsx";
import DocumentMaster from "./component/adminDashboard/pages/DocumentMaster.jsx";
import ServiceMaster from "./component/adminDashboard/pages/ServiceMaster.jsx";
import CustomerMaster from "./component/adminDashboard/pages/CustomerMaster.jsx";
import EmployeeMaster from "./component/adminDashboard/pages/EmployeeMaster.jsx";
import AdminSignin from "./component/adminDashboard/AdminSignin.jsx";
import AdminLayout from "./component/adminDashboard/AdminLayout.jsx";
import AdminDashboard from "./component/adminDashboard/AdminDashboard.jsx";
import Lead from "./component/adminDashboard/pages/Lead.jsx";
import ContactPage from "./component/adminDashboard/pages/ContactPage.jsx";
import StoriesPage from "./component/adminDashboard/pages/StoriesPage.jsx";
import FeedbackPage from "./component/adminDashboard/pages/AdminFeedback.jsx";
import ServiceFAQ from "./component/adminDashboard/pages/ServiceFaq.jsx";
// import ProtectedRoute from "./component/ProtectedRoute.jsx";
import NotificationPage from "./component/adminDashboard/pages/Notification.jsx";
import OfferPage from "./component/adminDashboard/pages/Offer.jsx";
import UserLoginForm from "./component/adminDashboard/pages/User/Userlogin.jsx";
import UserLayout from "./component/adminDashboard/pages/User/UserLayout.jsx";
import UserProfilePage from "./component/adminDashboard/pages/User/UserProfile.jsx";
import UserDashboardPage from "./component/adminDashboard/pages/User/UserDashboard.jsx";
import UserFeedback from "./component/adminDashboard/pages/User/Userfeedback.jsx";
import UserCompanyDetails from "./component/adminDashboard/pages/User/Usercompanydetails.jsx";
import UserServiceRequests from "./component/adminDashboard/pages/User/Userservicerequested.jsx";
import UserCompletedService from "./component/adminDashboard/pages/User/Usercompleteservice.jsx";
import UserPaymentHistory from "./component/adminDashboard/pages/User/Userpaymenthistory.jsx";
import ServicePage from "./component/adminDashboard/pages/User/ServicePage.jsx";
import SubscriptionPage from "./component/adminDashboard/pages/User/SubscriptionPage.jsx";
import AdminReseller from "./component/adminDashboard/AdminReseller.jsx";
import ProtectedRoute  from "./component/ProtectedRoute.jsx";
import RoleBasedLayout from "./component/adminDashboard/pages/User/UserLayout.jsx";
import ResellerDashboard from "./component/adminDashboard/pages/Reseller1/Resellerdashboard.jsx";


// 🔹 ScrollToTop component (resets scroll on route change)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ---------- Routes that use the Layout ---------- */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/form" element={<QuickForm />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/income-tax" element={<IncomeTax />} />
          <Route path="/gst" element={<Gst />} />
          <Route path="/startup-registrations" element={<StartUp />} />
          <Route path="/company" element={<Company />} />
          <Route path="/trade-mark" element={<Trademark />} />
          <Route path="/bank-valuation" element={<Bankvaluation />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/term-condition" element={<TermsAndConditions />} />
          <Route path="/reseller" element={<ResellerRegistrationForm />} />
          <Route path="/service-provider" element={<ServiceProviderForm />} />
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/company-details" element={<CompanyDetail />} />
          <Route path="/company-detailform" element={<CompanyDetailForm />} />
          <Route path="/myrequests" element={<MyRequests />} />
          <Route path="/completed-services" element={<CompletedService />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/proceed/:service" element={<ProceedTo />} />
          <Route path="/document" element={<DocumentUpload />} />
          <Route
            path="/service/:serviceName/proceed-to-payment"
            element={<ProceedToPayment />}
          />
          <Route
            path="/service/:service_name/partial-to-payment"
            element={<PartialPayment />}
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/accounting-service" element={<AccountingService />} />
          <Route path="accounting-training" element={< AccountingTranning />} />
        </Route>
        <Route path="*" element={<NotFound />} />

        {/* ---------- Routes WITHOUT Layout ---------- */}
        <Route path="/gst-odisha" element={<GstAds />} />
        <Route path="/itr-odisha" element={<ItrAds />} />

        <Route path="/startup-odisha" element={<StartupAds />} />
        <Route path="/company-odisha" element={<CompanyAds />} />
        <Route path="/trade-mark-odisha" element={<TrademarkAds />} />
        <Route path="/legal-odisha" element={<LegalAds />} />
        {/* <Route path="/adminlogin" element={<AdminSignin />} /> */}

        {/* ____ User Routes ____ */}
        {/* <Route path="/userlogin" element={<UserLoginForm />} />
        <Route
          path="/user"
          element={
            <ProtectedRoute role="customer">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserProfilePage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="feedback" element={<UserFeedback />} />
          <Route path="company-details" element={<UserCompanyDetails />} />
          <Route path="service-requests" element={<UserServiceRequests />} />
          <Route path="completed-services" element={<UserCompletedService />} />
          <Route path="payment-history" element={<UserPaymentHistory />} />
          <Route path="service" element={<ServicePage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
        </Route> */}

        {/* <Route path="/reseller/dashboard" element={
          <ProtectedRoute role="reseller">
            <ResellerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/provider/dashboard" element={
          <ProtectedRoute role="service_provider">
            <ProviderDashboard />
          </ProtectedRoute>
        } /> 
         */}
        {/* ______ Admin Routes ______ */}

        <Route path="/adminlogin" element={<AdminSignin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Leads */}
          <Route path="leads" element={<Lead />} />

          {/* Masters */}
          <Route path="menu-master" element={<MenuMaster />} />
          <Route path="document-master" element={<DocumentMaster />} />
          <Route path="service-master" element={<ServiceMaster />} />
          <Route path="customer-master" element={<CustomerMaster />} />
          <Route path="employee-master" element={<EmployeeMaster />} />
          <Route path="reseller-master" element={<AdminReseller />} />

          {/* Other */}
          <Route path="contact" element={<ContactPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="feedbackpage" element={<FeedbackPage />} />
          <Route path="servicefaq" element={<ServiceFAQ />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="offers" element={<OfferPage />} />
          <Route path="payment-settings" element={<PaymentHistory />} />
        </Route>



        {/* NewRoutes in role base  */}

        {/* Public Routes */}
        <Route path="/userlogin" element={<UserLoginForm />} />
        <Route path="/" element={<Navigate to="/userlogin" />} />

        {/* Protected Routes with Role-Based Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedLayout />}>
            {/* Customer Routes */}
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/service-requests" element={<UserServiceRequests />} />

            {/* Reseller Routes */}
            <Route path="/reseller/dashboard" element={
              <ProtectedRoute allowedRoles={["reseller"]}>
                <ResellerDashboard />
              </ProtectedRoute>
            } />
            {/* <Route path="/reseller/profile" element={
              <ProtectedRoute allowedRoles={["reseller"]}>
                <ResellerProfile />
              </ProtectedRoute>
            } /> */}
            {/* <Route path="/reseller/commission" element={
              <ProtectedRoute allowedRoles={["reseller"]}>
                <ResellerCommission />
              </ProtectedRoute>
            } /> */}

            {/* Service Provider Routes */}
            {/* <Route path="/provider/dashboard" element={
              <ProtectedRoute allowedRoles={["service_provider"]}>
                <ServiceProviderDashboard />
              </ProtectedRoute>
            } />
            <Route path="/provider/profile" element={
              <ProtectedRoute allowedRoles={["service_provider"]}>
                <ServiceProviderProfile />
              </ProtectedRoute>
            } />
            <Route path="/provider/completed-services" element={
              <ProtectedRoute allowedRoles={["service_provider"]}>
                <CompletedServices />
              </ProtectedRoute>
            } /> */}
          </Route>
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/userlogin" />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
