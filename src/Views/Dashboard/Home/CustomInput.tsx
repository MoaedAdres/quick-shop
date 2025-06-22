import { Input } from "@/components/ui/input";
import { icons } from "@/Constants/icons";
import RFlex from "@/RComponents/RFlex";
import { useTranslation } from "react-i18next";

const CustomInput = () => {
  const { t } = useTranslation();
  return (
    <RFlex className="relative w-full ">
      <Input type="text" className="h-[60px] flex-[0.8] rounded-full !bg-muted" />
      <div className="w-[35px] h-[35px] bg-chart-4 rounded-full absolute flex items-center justify-center left-[2%] top-[18%]">
        <i className={`${icons.search} text-foreground `} />
      </div>
      <div className="absolute flex flex-col text-sm top-1/8 left-1/7">
        <p>{t("search_on_products")}</p>
        <p className="text-muted-foreground">{t("electronics_clothes_anything")}</p>
      </div>
    </RFlex>
  );
};

export default CustomInput;
