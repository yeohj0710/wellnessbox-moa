"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { questions, FIRST_QUESTION_ID } from "./questions";
import { getRecommendations } from "./recommend";
import { Category } from "./categories";

export default function Survey() {
  const [initDone, setInitDone] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState<
    Record<string, { value: string; text: string }>
  >({});
  const [current, setCurrent] = useState<string>(FIRST_QUESTION_ID);
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [diseases, setDiseases] = useState<string[]>([]);
  const [results, setResults] = useState<Category[] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const res = await fetch("/api/survey");
      if (res.ok) {
        const data = await res.json();
        setLoggedIn(data.loggedIn);
        if (data.loggedIn && data.name) {
          setUserName(data.name);
          setAnswers({ name: { value: "entered", text: data.name } });
          setCurrent("gender");
        }
        if (Array.isArray(data.recommendations)) {
          localStorage.setItem(
            "recommendedSupplements",
            JSON.stringify(data.recommendations)
          );
        }
      }
      setInitDone(true);
    };
    init();
  }, []);

  if (!initDone) return null;

  const handleAnswer = async (value: string, text: string) => {
    const q = questions[current];
    const updated = { ...answers, [q.id]: { value, text } };
    setAnswers(updated);

    let nextId: string | undefined;
    if (q.id === "medicalList") {
      nextId = "bloodSugar";
    } else {
      nextId = q.options.find((o) => o.value === value)?.next;
    }

    if (nextId) {
      setCurrent(nextId);
      return;
    }

    setSubmitting(true);
    const payload = Object.fromEntries(
      Object.entries(updated).map(([k, v]) => [k, v.value])
    );
    const recs = getRecommendations(payload as Record<string, string>);

    if (loggedIn) {
      const answersArr = Object.entries(updated).map(([id, a]) => ({
        question: questions[id].question,
        answer: a.text,
      }));
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersArr, recommendations: recs }),
      });
    } else {
      localStorage.setItem("surveyAnswers", JSON.stringify(updated));
      localStorage.setItem("recommendedSupplements", JSON.stringify(recs));
    }

    setResults(recs);
    setSubmitting(false);
  };

  const slideProps = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <AnimatePresence mode="wait">
      {results ? (
        <motion.div
          key="results"
          {...slideProps}
          className="flex flex-col items-center gap-6 py-10"
        >
          <h2 className="text-2xl font-semibold">추천 결과</h2>
          <ul className="grid gap-2">
            {results.map((r) => (
              <li
                key={r}
                className="w-72 px-4 py-2 bg-white rounded shadow text-center font-bold"
              >
                {r}
              </li>
            ))}
          </ul>
          <button
            onClick={() => (window.location.href = "/supplements")}
            className="cursor-pointer mt-6 px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/80"
          >
            영양제 구매하기
          </button>
        </motion.div>
      ) : submitting ? (
        <motion.div
          key="loading"
          {...slideProps}
          className="py-10 flex flex-col items-center gap-2 text-center"
        >
          <svg
            className="animate-spin h-8 w-8 text-primary"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          저장 중…
        </motion.div>
      ) : (
        <motion.div
          key={current}
          {...slideProps}
          className="py-10 max-w-md mx-auto"
        >
          {/* 이름 입력 */}
          {current === "name" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="mb-4 text-lg font-medium text-center">
                {questions[current].question}
              </h2>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-3 py-2 mb-4 border rounded"
              />
              <button
                disabled={!nameInput.trim()}
                onClick={() => handleAnswer("entered", nameInput.trim())}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 cursor-pointer"
              >
                다음
              </button>
            </div>
          )}

          {/* 나이 입력 */}
          {current === "age" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="mb-4 text-lg font-medium text-center">
                {questions[current].question}
              </h2>
              <input
                type="number"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                placeholder="나이를 입력하세요"
                className="w-full px-3 py-2 mb-4 border rounded"
              />
              <button
                disabled={!ageInput || Number(ageInput) <= 0}
                onClick={() => handleAnswer("entered", `${ageInput}세`)}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 cursor-pointer"
              >
                다음
              </button>
            </div>
          )}

          {/* 키/몸무게 입력 */}
          {current === "heightweight" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="mb-4 text-lg font-medium text-center">
                {questions[current].question}
              </h2>
              <input
                type="number"
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                placeholder="키 (cm)"
                className="w-full px-3 py-2 mb-2 border rounded"
              />
              <input
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="몸무게 (kg)"
                className="w-full px-3 py-2 mb-4 border rounded"
              />
              <button
                disabled={
                  !heightInput ||
                  Number(heightInput) <= 0 ||
                  !weightInput ||
                  Number(weightInput) <= 0
                }
                onClick={() =>
                  handleAnswer("entered", `${heightInput}cm, ${weightInput}kg`)
                }
                className="w-full px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 cursor-pointer"
              >
                다음
              </button>
            </div>
          )}

          {/* 질환 선택 */}
          {current === "medicalList" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="mb-4 text-lg font-medium text-center">
                {questions[current].question}
              </h2>
              <div className="flex flex-col gap-2 mb-4">
                {questions[current].options.map((o) => (
                  <label key={o.value} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={diseases.includes(o.value)}
                      onChange={() => {
                        if (diseases.includes(o.value)) {
                          setDiseases(diseases.filter((d) => d !== o.value));
                        } else {
                          if (o.value === "none") {
                            setDiseases(["none"]);
                          } else {
                            setDiseases(
                              diseases
                                .filter((d) => d !== "none")
                                .concat(o.value)
                            );
                          }
                        }
                      }}
                    />
                    {o.text}
                  </label>
                ))}
              </div>
              <button
                disabled={diseases.length === 0}
                onClick={() =>
                  handleAnswer(
                    diseases.join(","),
                    diseases
                      .map(
                        (v) =>
                          questions[current].options.find((o) => o.value === v)
                            ?.text
                      )
                      .filter(Boolean)
                      .join(", ")
                  )
                }
                className="w-full px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 cursor-pointer"
              >
                다음
              </button>
            </div>
          )}

          {/* 그 외 선택지 */}
          {!["name", "age", "heightweight", "medicalList"].includes(
            current
          ) && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="mb-4 text-lg font-medium text-center">
                {questions[current].question}
              </h2>
              <div className="flex flex-col gap-2">
                {questions[current].options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => handleAnswer(o.value, o.text)}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition cursor-pointer"
                  >
                    {o.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
