import cls from './style.module.scss';

const titleSubHeaderClassName = 'text-2xl font-normal leading-[32px] text-center text-[#171412]';

export const MainTitle = () => {
  return (
    <div className='mt-6 mb-4 flex flex-col items-center justify-center'>
      <span
        className={`${cls['title-header']} mb-[20px] text-center text-[44px] leading-[57.2px] font-normal text-[#171412]`}
      >
        CyberPravda
      </span>
      <span className={`${cls['title-subheader']} ${titleSubHeaderClassName}`}>The place where you can see</span>
      <span className={`${cls['title-subheader']} ${titleSubHeaderClassName}`}>
        multiple versions on one topic / event,
      </span>
      <span className={`${cls['title-subheader']} ${titleSubHeaderClassName}`}>
        and see which version is the most reliable
      </span>
    </div>
  );
};
