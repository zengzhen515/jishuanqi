document.addEventListener('DOMContentLoaded', function () {
    const A = document.getElementById('A');
    const B1Toggle = document.getElementById('B1-toggle');
    const B2Toggle = document.getElementById('B2-toggle');
    const EToggle = document.getElementById('E-toggle');
    const G = document.getElementById('G');
    const finalResult = document.getElementById('final-result');
    const confirmBtn = document.getElementById('confirm');
    const settingsBtn = document.getElementById('settings');
    const showRecordsBtn = document.getElementById('show-records');
    const recordsModal = document.getElementById('records-modal');
    const recordsList = document.getElementById('records-list');
    const closeModal = document.querySelector('.close');
    const imageButtons = ['image1', 'image2', 'image3'];

    // 从 localStorage 加载设置
    const B1Value = localStorage.getItem('B1') || 0;
    const B2Value = localStorage.getItem('B2') || 0;
    const DValue = localStorage.getItem('D') || 0;
    const EValue = localStorage.getItem('E') || 0;
    const GValue = localStorage.getItem('G') || 0;

    // 初始化高价卡和低价卡的开关状态
    let selectedB = localStorage.getItem('selectedB') || 'B1';
    if (selectedB === 'B1') {
        B1Toggle.classList.add('active');
    } else {
        B2Toggle.classList.add('active');
    }

    // 高价卡和低价卡开关按钮逻辑
    B1Toggle.addEventListener('click', function () {
        selectedB = 'B1';
        localStorage.setItem('selectedB', selectedB);
        B1Toggle.classList.add('active');
        B2Toggle.classList.remove('active');
        calculate(); // 实时计算
    });

    B2Toggle.addEventListener('click', function () {
        selectedB = 'B2';
        localStorage.setItem('selectedB', selectedB);
        B2Toggle.classList.add('active');
        B1Toggle.classList.remove('active');
        calculate(); // 实时计算
    });

    // 加油员开关状态
    let isEActive = false;

    // 加油员开关按钮逻辑
    EToggle.addEventListener('click', function () {
        isEActive = !isEActive;
        EToggle.textContent = isEActive ? '打开' : '关闭';
        EToggle.classList.toggle('active');
        calculate(); // 实时计算
    });

    // 实时计算逻辑
    function calculate() {
        const AValue = parseFloat(A.value) || 0;
        const BValue = selectedB === 'B1' ? parseFloat(B1Value) : parseFloat(B2Value);
        const DValue = parseFloat(localStorage.getItem('D')) || 0;
        const EValue = isEActive ? parseFloat(localStorage.getItem('E')) : 0;
        const GCount = parseFloat(G.value) || 0;
        const GTotal = GCount * parseFloat(localStorage.getItem('G'));

        const CValue = AValue / BValue;
        const FValue = CValue * (DValue + EValue);
        const finalValue = FValue + GTotal;

        finalResult.textContent = finalValue.toFixed(2);
    }

    // 输入框实时计算
    A.addEventListener('input', calculate);
    G.addEventListener('input', calculate);

    // 确认按钮逻辑
    confirmBtn.addEventListener('click', function () {
        const finalValue = parseFloat(finalResult.textContent);
        if (!isNaN(finalValue)) {
            // 保存记录
            const record = {
                time: new Date().toLocaleString(),
                value: finalValue.toFixed(2)
            };
            saveRecord(record);
            alert('记录已保存！');
        } else {
            alert('请先填写有效值！');
        }
    });

    // 设置按钮逻辑
    settingsBtn.addEventListener('click', function () {
        window.location.href = 'settings.html';
    });

    // 图片按钮逻辑
    imageButtons.forEach((buttonId, index) => {
        const button = document.getElementById(buttonId);
        button.addEventListener('click', function () {
            const imageUrl = localStorage.getItem(`image${index + 1}`);
            if (imageUrl) {
                // 创建新窗口显示图片
                const imageWindow = window.open('', '_blank', 'width=600,height=400');
                imageWindow.document.write(`
                    <html>
                        <head>
                            <title>图片 ${index + 1}</title>
                            <style>
                                body, html {
                                    margin: 0;
                                    padding: 0;
                                    height: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    background-color: rgba(0, 0, 0, 0.8);
                                    cursor: pointer;
                                }
                                img {
                                    max-width: 100%;
                                    max-height: 100%;
                                }
                            </style>
                        </head>
                        <body>
                            <img src="${imageUrl}" alt="图片 ${index + 1}">
                        </body>
                    </html>
                `);

                // 点击任意位置关闭图片
                imageWindow.document.body.addEventListener('click', function () {
                    imageWindow.close();
                });
            } else {
                alert('请先在设置页面上传图片');
            }
        });
    });

    // 记录查询按钮逻辑
    showRecordsBtn.addEventListener('click', function () {
        recordsModal.style.display = 'flex';
        loadRecords();
    });

    // 关闭模态框（点击关闭按钮）
    closeModal.addEventListener('click', function () {
        recordsModal.style.display = 'none';
    });

    // 关闭模态框（点击模态框外部）
    window.addEventListener('click', function (event) {
        if (event.target === recordsModal) {
            recordsModal.style.display = 'none';
        }
    });

    // 保存记录
    function saveRecord(record) {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        records.push(record);
        localStorage.setItem('records', JSON.stringify(records));
        clearOldRecords(); // 清理过期记录
    }

    // 加载记录
    function loadRecords() {
        const records = JSON.parse(localStorage.getItem('records')) || [];
        recordsList.innerHTML = '';
        records.forEach(record => {
            const li = document.createElement('li');
            li.textContent = `${record.time} - 最终值: ${record.value}`;
            recordsList.appendChild(li);
        });
    }

    // 清理过期记录（3 天后自动覆盖或删除）
    function clearOldRecords() {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        const now = new Date();
        records = records.filter(record => {
            const recordTime = new Date(record.time);
            return (now - recordTime) / (1000 * 60 * 60 * 24) <= 3; // 保留 3 天内的记录
        });
        localStorage.setItem('records', JSON.stringify(records));
    }
});