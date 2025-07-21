import React, { useState } from "react";

function App() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [response, setResponse] = useState("");

  const handleGet = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/get?param=${input1}`);
      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      setResponse("GET 请求失败");
    }
  };

  const handlePost = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/post/${input3}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body_param: input2 }),
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      setResponse("POST 请求失败");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>React 与 Flask 联调示例</h2>

      <div>
        <input
          placeholder="输入框 1 (GET param)"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
        />
        <button onClick={handleGet}>发送 GET 请求</button>
      </div>

      <br />

      <div>
        <input
          placeholder="输入框 2 (POST body)"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
        />
        <input
          placeholder="输入框 3 (POST param)"
          value={input3}
          onChange={(e) => setInput3(e.target.value)}
        />
        <button onClick={handlePost}>发送 POST 请求</button>
      </div>

      <br />

      <div>
        <strong>服务器返回：</strong> {response}
      </div>
    </div>
  );
}

export default App;
