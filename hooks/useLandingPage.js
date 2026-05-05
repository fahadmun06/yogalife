"use client";

import { useDispatch, useSelector } from "react-redux";

import ApiFunction from "../components/api/apiFuntions";
import {
  serviceApi,
  aboutApi,
  whyChooseUsApi,
  butterflyApi,
  testimonialsApi,
  blogsApi,
  transformationApi,
  retroApi,
  contactApi,
  faqApi,
} from "../components/api/ApiRoutesFile";
import {
  setHeroData,
  setServicesData,
  setAboutData,
  setWhyChooseUsData,
  setButterflyData,
  setTestimonialsData,
  setBlogData,
  setBlogSettings,
  setRetroData,
  setContactData,
  setFaqData,
  setTransformationData,
} from "../store/slices/landingPageSlice";

export const useLandingPage = () => {
  const dispatch = useDispatch();
  const { get } = ApiFunction();
  const landingData = useSelector((state) => state.landingPage);

  const fetchData = async (apiPath, action, sectionKey, nestedKey = null) => {
    try {
      const res = await get(apiPath);
      // console.log("res", res);

      if (res && res.success) {
        const payload = res.data || (nestedKey ? [] : {});

        if (nestedKey) {
          dispatch(action({ [nestedKey]: payload }));
        } else {
          dispatch(action(payload));
        }

        return res.data;
      }
    } catch (err) {
      console.error(`Error fetching ${sectionKey}:`, err);
    }
  };

  const getHero = async () => {
    if (landingData.hero) return landingData.hero;

    return await fetchData("/banner?type=free", setHeroData, "hero");
  };

  const getServices = async () => {
    if (landingData.services) return landingData.services;

    return await fetchData(serviceApi.get, setServicesData, "services");
  };

  const getAbout = async () => {
    if (landingData.about) return landingData.about;

    return await fetchData(aboutApi.get, setAboutData, "about");
  };

  const getWhyChooseUs = async () => {
    if (landingData.whyChooseUs) return landingData.whyChooseUs;

    return await fetchData(
      whyChooseUsApi.get,
      setWhyChooseUsData,
      "whyChooseUs",
    );
  };

  const getButterfly = async () => {
    if (landingData.butterfly) return landingData.butterfly;

    return await fetchData(butterflyApi.get, setButterflyData, "butterfly");
  };

  const getTestimonials = async () => {
    if (landingData.testimonials) return landingData.testimonials;

    return await fetchData(
      testimonialsApi.getAll,
      setTestimonialsData,
      "testimonials",
    );
  };

  const getBlogs = async (options = {}) => {
    const forceRefresh =
      options === true || options?.forceRefresh === true;

    if (
      !forceRefresh &&
      landingData.blog &&
      landingData.blogSettings
    ) {
      return { blogs: landingData.blog, settings: landingData.blogSettings };
    }

    try {
      const [blogsRes, settingsRes] = await Promise.all([
        get(blogsApi.getAll),
        get(blogsApi.getSettings),
      ]);

      if (blogsRes.success) {
        dispatch(setBlogData(blogsRes.data));
      }
      if (settingsRes.success) {
        dispatch(setBlogSettings(settingsRes.data));
      }

      return { blogs: blogsRes.data, settings: settingsRes.data };
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const getTransformations = async () => {
    if (landingData.transformation.images.length > 0)
      return landingData.transformation;

    try {
      const [imagesRes, settingsRes] = await Promise.all([
        get(transformationApi.getAll),
        get(transformationApi.getSettings),
      ]);

      if (imagesRes.success) {
        dispatch(setTransformationData({ images: imagesRes.data }));
      }
      if (settingsRes.success) {
        dispatch(setTransformationData({ settings: settingsRes.data }));
      }

      return { images: imagesRes.data, settings: settingsRes.data };
    } catch (err) {
      console.error("Error fetching transformations:", err);
    }
  };

  const getRetro = async () => {
    if (landingData.retro) return landingData.retro;
    const data = await fetchData(retroApi.get, setRetroData, "retro");

    return data;
  };

  const getContact = async () => {
    if (landingData.contact) return landingData.contact;

    return await fetchData(contactApi.get, setContactData, "contact");
  };

  const getFaqs = async () => {
    if (landingData.faqs?.length > 0) return landingData.faqs;

    return await fetchData(faqApi.get, setFaqData, "faqs");
  };

  return {
    ...landingData,
    getHero,
    getServices,
    getAbout,
    getWhyChooseUs,
    getButterfly,
    getTestimonials,
    getBlogs,
    getTransformations,
    getRetro,
    getContact,
    getFaqs,
  };
};
