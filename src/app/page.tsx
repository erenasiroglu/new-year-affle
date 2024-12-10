"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DrawMethod = "classic" | "mutual";

const drawMethods = {
  classic: "Klasik Çekiliş: Herkes rastgele birine hediye alır",
};

export default function Home() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<DrawMethod | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showResults, setShowResults] = useState<boolean>(false);
  const [drawResults, setDrawResults] = useState<
    { giver: string; receiver: string }[]
  >([]);
  const [revealedCount, setRevealedCount] = useState(0);

  const addParticipant = () => {
    if (
      newParticipant.trim() &&
      !participants.includes(newParticipant.trim())
    ) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const performDraw = () => {
    const results: { giver: string; receiver: string }[] = [];
    let available = [...participants];
    const givers = [...participants];

    givers.forEach((giver) => {
      const possibleReceivers = available.filter((p) => p !== giver);
      const receiver =
        possibleReceivers[Math.floor(Math.random() * possibleReceivers.length)];
      results.push({ giver, receiver });
      available = available.filter((p) => p !== receiver);
    });

    setDrawResults(results);
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-[#1a472a] p-8 cursor-[url('/pointer.png'),_auto]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr,1fr] gap-6">
        <div className="space-y-6">
          <Card className="bg-white bg-opacity-95 shadow-xl">
            <CardContent className="p-5">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center text-green-800">
                  🎄 Katılımcılar
                </h2>
                <div className="flex space-x-2">
                  <Input
                    className="text-base"
                    placeholder="Katılımcı adı girin"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addParticipant()}
                  />
                  <Button
                    onClick={addParticipant}
                    className="bg-red-600 hover:bg-red-700 px-4"
                  >
                    Ekle
                  </Button>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-2">
                    Katılımcılar ({participants.length})
                  </h3>
                  <div className="max-h-[200px] overflow-y-auto">
                    {participants.map((participant) => (
                      <div
                        key={participant}
                        className="flex justify-between items-center bg-slate-100 p-2 rounded mb-1.5 text-base"
                      >
                        {participant}
                        <Button
                          variant="ghost"
                          onClick={() => removeParticipant(participant)}
                          className="h-7 w-7"
                        >
                          ✖
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-95 shadow-xl">
            <CardContent className="p-5">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center text-green-800">
                  🎅 Çekiliş Kuralları
                </h2>
                <Select
                  onValueChange={(value: DrawMethod) =>
                    setSelectedMethod(value)
                  }
                >
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Çekiliş Yöntemi Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(drawMethods).map(
                      ([method, description]) => (
                        <SelectItem
                          key={method}
                          value={method}
                          className="text-base"
                        >
                          {description}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <Button
                  onClick={performDraw}
                  disabled={!selectedMethod || participants.length < 3}
                  className="w-full bg-red-600 hover:bg-red-700 text-base py-5"
                >
                  Çekilişi Başlat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card
          className="bg-white bg-opacity-95 shadow-xl h-fit"
          onClick={() =>
            revealedCount < drawResults.length &&
            setRevealedCount(revealedCount + 1)
          }
        >
          <CardContent className="p-5">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center text-green-800">
                🎁 Sonuçlar
              </h2>
              {drawResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-base">Katılımcıları ekleyip</p>
                  <p className="text-base">çekilişi başlatın</p>
                  <div className="mt-4 text-4xl">🎄</div>
                </div>
              ) : (
                <>
                  <p className="text-center text-gray-600 text-sm mb-4 animate-bounce">
                    {revealedCount < drawResults.length ? (
                      <span className="bg-red-100 px-3 py-1 rounded-full">
                        🎅 Eşleşmeleri görmek için tıklayın!
                      </span>
                    ) : (
                      <span className="text-green-600">
                        🎄 Tüm eşleşmeler açıklandı!
                      </span>
                    )}
                  </p>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {drawResults.map((result, index) => (
                      <div
                        key={index}
                        className={`transform transition-all duration-700 ${
                          index < revealedCount
                            ? "translate-y-0 opacity-100 blur-none scale-100"
                            : "translate-y-4 opacity-0 blur-sm scale-95 pointer-events-none"
                        }`}
                        style={{ transitionDelay: `${index * 300}ms` }}
                      >
                        <Card
                          className={`
                          bg-green-50 p-3 
                          ${index === revealedCount - 1 ? "animate-wiggle" : ""}
                          transition-all duration-500
                        `}
                        >
                          <p className="text-base text-center">
                            <span className="font-bold text-red-600">
                              {result.giver}
                            </span>{" "}
                            ➡️{" "}
                            <span className="font-bold text-green-800">
                              {result.receiver}
                            </span>
                          </p>
                        </Card>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
