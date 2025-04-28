import BrandSlider from "../BrandSlider";

const brands = [
  { id: 1, name: "Brand 1", logo: "assets/avastlogo.png" },
  { id: 2, name: "Brand 2", logo: "assets/amazonlogo.png" },
  { id: 3, name: "Brand 3", logo: "assets/microsoftlogo.png" },
  { id: 4, name: "Brand 4", logo: "assets/pslogo.jpg" },
];

const SectionOne = () => {
  return <BrandSlider brands={brands} />;
};
export default SectionOne;
