interface RoomPageProps {
  params: {
    code: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Room: {params.code}</h1>
      <p>Room content will be displayed here</p>
    </div>
  );
}