import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout, { siteTitle } from "./components/Layout";

import utilStyle from "../styles/utils.module.css";
import Link from "next/link";
import { getPostsData } from "../lib/post";

//SSGの場合
//getStaticProps:外部から一度だけデータを取ってくるときに使用
export async function getStaticProps() {
  const allPostsData = getPostsData(); //id, title, date, thumbnail
  console.log(allPostsData);

  //returnの記入法はgetStaticProps()独特のもの
  return {
    props: {
      allPostsData,
    },
  };
}

//SSRの場合
//context:ユーザがリクエストした内容
/* export async function getServerSideProps(context) {
  return {
    props: {
      //コンポーネントに渡すためのprops
    }
  }
} */

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyle.headingMd}>
        <p>私は会社員です</p>
      </section>

      <section>
        <h2>☑エンジニアのブログ</h2>
        <div className={styles.grid}>
          {allPostsData.map(({ id, title, date, thumbnail }) => (
            //articleを一意のkeyで指定することができる
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <img src={`${thumbnail}`} className={styles.thumbnailImage} />
              </Link>
              <Link href={`/posts/${id}`}>
                <a className={utilStyle.boldText}>{title}</a>
              </Link>
              <br />
              <small className={utilStyle.lightText}>{date}</small>
            </article>
          ))}
          <article>
            <Link href="/">
              <img
                src="/images/thumbnail01.jpg"
                className={styles.thumbnailImage}
              />
            </Link>
            <Link href="/">
              <a className={utilStyle.boldText}>
                SSGとSSRの使い分けの場面はいつなのか？
              </a>
            </Link>
            <br />
            <small className={utilStyle.lightText}>Febrary 23, 2020</small>
          </article>
        </div>
      </section>
    </Layout>
  );
}
