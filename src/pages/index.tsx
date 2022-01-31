import { useState } from 'react';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [pagination, setPagination] = useState(postsPagination);

  function loadMore() {
    fetch(pagination.next_page, {})
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        const newPagination: PostPagination = {
          next_page: result.next_page,
          results: [
            ...pagination.results,
            ...result.results,
          ],
        };
        setPagination(newPagination);
      })
      .catch((error) => {
        return console.log(error.message);
      });
    return;
  };

  return (
    <main className={styles.container}>
      <Image src="/Logo.svg" alt="logo" width="239" height="26" />
      <ul>
        {pagination.results.map((post) => {
          return (
            <li key={post.uid}>
              <Link href={`/post/${post.uid}`} >
                <a>
                  <h2>{post.data.title}</h2>
                </a>
              </Link>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <FiCalendar size='1rem' />
                  {format(
                    new Date(post.first_publication_date),
                    'PP',
                    { locale: ptBR },
                  )}
                </span>
                <span>
                  <FiUser size='1rem' />
                  {post.data.author}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {pagination.next_page && (
        <button
          onClick={() => loadMore()}
        >
          Carregar mais posts
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 2,
    },
  );
  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
