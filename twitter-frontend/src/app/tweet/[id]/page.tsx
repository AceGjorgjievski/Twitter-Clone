import TweetDetailsView from "@/sections/tweet-details/view";


type TweetPageProps = {
  params: {
    id: string;
  };
};


export default async function TweetDetails({params}: TweetPageProps) {
    const { id } = await params;
    return (
        <TweetDetailsView tweetId={+id}/>
    );
}
