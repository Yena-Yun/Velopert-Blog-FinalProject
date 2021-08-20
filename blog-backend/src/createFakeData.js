import Post from './models/post';

export default function createFakeData() {
  // 0, 1, ... 39로 이루어진 크기 40짜리 배열을 생성한 후
  // 배열의 각 객체마다 title, body, tags를 지정해서 배열 반환
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    // https://www.lipsum.com/에서 복사한 200자 이상의 텍스트
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi risus massa, scelerisque non nunc a, euismod porttitor purus. Etiam facilisis ipsum sapien. Maecenas hendrerit leo eros, at varius orci vestibulum non. Aenean ipsum ex, interdum eget neque eu, accumsan malesuada nibh. Duis elementum tortor egestas, varius nulla eget, consequat tortor. Proin at neque hendrerit, convallis purus non, ornare justo. In posuere elementum purus, cursus scelerisque orci malesuada et. Suspendisse quis ipsum in nibh egestas mattis vitae in risus. Integer orci ligula, efficitur ac consectetur eget, laoreet a ante. Integer bibendum in ipsum non commodo. Etiam vitae posuere arcu. Vestibulum dapibus vestibulum elit at scelerisque.',
    tags: ['가짜', '데이터'],
  }));

  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
