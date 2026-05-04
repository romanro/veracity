import { newArgumentId } from '@/core/constants/argument';
import { type TArgument } from '@/core/models/Argument.model';

export const calculateIndicatorValue = (arrArguments: TArgument[]): number => {
  if (!arrArguments || arrArguments.length === 0) {
    return -1;
  }

  const totalArguments = arrArguments.length;
  const myArguments = arrArguments.reduce((acc, arg) => {
    return String(arg.id).includes(newArgumentId) ? acc + 1 : acc;
  }, 0);

  return totalArguments - myArguments === 0 ? -1 : (totalArguments - myArguments) / totalArguments;
};

export const getActionArgument = (typeArg: string | number) => {
  if (typeArg === 'approve') {
    return true;
  } else if (typeArg === 'refuse') {
    return false;
  } else {
    return true;
  }
};
