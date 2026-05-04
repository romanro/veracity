import { type FC } from 'react';
import { type TAuthorsSideMenuProps } from './AuthorsSideMenu.models';
import { AuthorsMenuItem } from './AuthorsMenuItem';
import { AuthorsMenuConsensusButton } from './AuthorsMenuConsensusButton';

export const AuthorsSideMenu: FC<TAuthorsSideMenuProps> = ({ authors }) => {
  return (
    <aside className='fixed top-[4rem] right-0 z-100 hidden h-[calc(100vh-4rem)] items-center min-[1400px]:max-w-[17rem] xl:flex xl:max-w-[12rem] 2xl:max-w-[20rem]'>
      <ul className='flex flex-col items-end justify-center gap-4 !p-2 text-sm min-[1400px]:max-w-[17rem] xl:max-w-[12rem] 2xl:max-w-[20rem]'>
        <li>
          <AuthorsMenuConsensusButton />
        </li>
        {authors.map((author) => {
          const { id } = author;
          return (
            <li key={id}>
              <AuthorsMenuItem author={author} />
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
