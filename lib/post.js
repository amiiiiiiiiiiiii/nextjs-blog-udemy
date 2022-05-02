import path from "path";
import fs from "fs";
//メタデータを読み取る
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

//process.cwd():現在いるディレクトリー全て
//path.join():現在いるディレクトリの中のpostsフォルダをpathとして取得
const postsDirectory = path.join(process.cwd(), "posts");

//mdファイルのデータを取り出す
export function getPostsData() {
  //postsフォルダ内にあるファイル名をオブジェクトの配列として返す
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    //mdの拡張子を取り除いた状態でidに格納
    const id = fileName.replace(/\.md$/, ""); //ファイル名(id)

    //マークダウンファイルを文字列として読み取る
    //各ファイルのパスを取得している
    const fullPath = path.join(postsDirectory, fileName);
    //ファイルの中身を文字列で読み取る
    const fileContents = fs.readFileSync(fullPath, "utf8");

    //メタデータ（title・date・thumbnailの情報）
    const matterResult = matter(fileContents);

    //allPostsDattaに対する返り値：idとデータを返す
    return {
      id,
      //メタデータの中身を一つ一つ出力
      ...matterResult.data,
    };
  });
  //getPostsDataに対する返り値
  return allPostsData;
}

//getStaticPathでreturnで使うpathを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        //ファイル名が[id]だから
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
  //返却値の例:オブジェクトで返す必要がある
  /* 
        [
            {
                params: {
                    id: "ssg-ssr"
                }
            },
            {
                params: {
                    id: "next-react"
                }
            }
        ]
    */
}

//idに基づいてブログ投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContent);

  //ブログの中身(matterResult.content=文字列)をHTMLに変換
  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  };
}
