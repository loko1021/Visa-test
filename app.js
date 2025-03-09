const questions = [
    {
        question: "1. 您的出行目的是什么？",
        options: [
            { text: "旅游/探亲", score: 3 },
            { text: "商务/会议", score: 2 },
            { text: "留学/学术交流", score: 2 },
            { text: "工作/移民", score: 1 }
        ]
    },
    {
        question: "2. 您的护照签发国家是？",
        options: [
            { text: "中国", score: 1 },
            { text: "美国免签国家（如加拿大、英国等）", score: 3 },
            { text: "其他需要签证的国家", score: 2 }
        ]
    },
    // 其他题目...
];

let currentQuestion = 0;
let totalScore = 0;

function loadQuestion() {
    const quiz = document.getElementById("quiz");
    quiz.innerHTML = `
        <h3>${questions[currentQuestion].question}</h3>
        ${questions[currentQuestion].options.map((option, index) => `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="question" id="option${index}" value="${option.score}">
                <label class="form-check-label" for="option${index}">${option.text}</label>
            </div>
        `).join("")}
    `;
}

function showResult() {
    const result = document.getElementById("result");
    let resultText = "";
    if (totalScore >= 25) {
        resultText = "<h4>结果：通过概率很高！</h4><p>您的条件非常符合美签要求，建议准备好相关材料，诚实回答签证官问题。</p>";
    } else if (totalScore >= 15) {
        resultText = "<h4>结果：通过概率中等。</h4><p>您的条件有一定优势，但可能需要补充材料或进一步证明您的 ties。</p>";
    } else {
        resultText = "<h4>结果：通过概率较低。</h4><p>建议您完善旅行计划、提供更多证明材料，或咨询专业签证顾问。</p>";
    }
    result.innerHTML = resultText;

    // 显示手机号输入框
    document.getElementById("phoneInput").style.display = "block";
    document.getElementById("submit").style.display = "none"; // 隐藏提交按钮
}

document.getElementById("submit").addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    if (selectedOption) {
        totalScore += parseInt(selectedOption.value);
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    } else {
        alert("请选择一个答案！");
    }
});

document.getElementById("savePhone").addEventListener("click", () => {
    const phone = document.getElementById("phone").value;
    if (phone) {
        // 发送数据到服务器
        sendDataToServer(phone, totalScore);
    } else {
        alert("请输入手机号！");
    }
});

function sendDataToServer(phone, score) {
    const data = {
        phone: phone,
        score: score
    };

    fetch("/save-result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("手机号和测评结果已保存！");
        } else {
            alert("保存失败，请重试！");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("网络错误，请重试！");
    });
}

// 初始化第一题
loadQuestion();