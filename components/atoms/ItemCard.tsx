import Link from 'next/link';
import { Item } from '../../types/types';

type ItemCardProps = {
  id: number;
  name: string;
  price: number;
  imagepath: string;
  type: string;
  description: string;
  delete: boolean;
};

export function ItemCard({
  id,
  name,
  price,
  imagepath,
}: ItemCardProps) {
  return (
    <Link href={`/posts/${id}`} legacyBehavior>
      <div className="overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80 cursor-pointer m-auto">
        <a href="#" className="w-full block h-full">
          <img
            alt="blog photo"
            src={imagepath}
            className="max-h-40 w-full object-cover"
          />
          <div className="bg-white dark:bg-gray-800 w-full p-4">
            <p className="text-indigo-500 text-md font-medium"></p>
            <p className="text-gray-800 dark:text-white text-xl font-medium mb-2">
              {name}
            </p>
            <p className="text-gray-400 dark:text-gray-300 font-light text-md">
              {price}円（税抜）
            </p>
          </div>
        </a>
      </div>
    </Link>
  );
}
