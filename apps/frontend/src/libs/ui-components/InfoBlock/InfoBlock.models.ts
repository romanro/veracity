export type TInfoBlockProps = {
  id: string | number;
  background?: number;
  info: {
    title: string;
    text: string;
    footerTitle?: string;
    footerText?: string;
  };
};
