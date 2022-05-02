import Head from "next/head";
import Layout from "../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/post";
import utilStyles from "../../styles/utils.module.css";

//getStaticPaths：外部のデータ・HTMLに対してもSSGができる
export async function getStaticPaths() {
  const paths = getAllPostIds();

  return {
    paths,
    //fallback=false:上のpath以外にアクセスすると404エラーになる
    //trueの時はそのpathのページを動的に生成してくれる
    //blockingの時は違うページ(読み込み中など)に飛ばずにすぐにエラーになる
    fallback: false,
  };
}

//getStaticProps：外部からのもの、Javaを読み込む
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  return (
    //dangerouslySetInnerHTML：文字列をHTMLに変換
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingX1}>{postData.title}</h1>
        <div className={utilStyles.lightText}>{postData.date}</div>
        <div dangerouslySetInnerHTML={{ __html: postData.blogContentHTML }} />
      </article>
    </Layout>
  );
}
