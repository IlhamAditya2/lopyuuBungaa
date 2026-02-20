const konten = [
    "image/p8.jpeg",
    "image/p1.jpeg",
    "image/p2.jpeg",
    "image/p3.jpeg",
    "image/p4.jpeg",
    "image/p5.jpeg",
    "image/p6.jpeg",
    "image/p8.jpeg",
    
];

const musik = "audio/AkuMilikmu.mp3";
const musikA = new Audio(musik);
musikA.loop = true;

const book = document.getElementById("book");
const btnContainer = document.querySelector(".btn-container");
const openBtn = document.querySelector('.open-btn');
const navBtn = document.querySelector(".nav");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const pesanBtn = document.querySelector('.pesan-btn');

for (let i = 0; i < konten.length; i += 2) {
    const paper = document.createElement('div');
    paper.classList.add('paper');

    const frontImg = konten[i] || '';
    const backImg = konten[i + 1] || '';

    paper.innerHTML = `
<div class="front">
    <div class="front-content" style="background-image:url('${frontImg}')"></div>
</div>
<div class="back">
    <div class="back-content" style="background-image:url('${backImg}')"></div>
</div>
`;

    book.appendChild(paper);
}

const papers = Array.from(document.querySelectorAll(".paper"));
const paperTotal = papers.length;
let currentLocation = 0;

// Set Z-Index Awal
let zInd = paperTotal;
let dataZIndex = [];
papers.forEach(p => {
    p.style.zIndex = zInd;
    dataZIndex.push(zInd);
    zInd--;
});

let canClick = true;

openBtn.onclick = () => {
    musikA.play().catch(e => console.log("Autoplay blocked"));
    openBook();
    btnContainer.classList.add("hide");

    setTimeout(() => {
        openBtn.classList.add("hide");
        navBtn.classList.add("show");
        btnContainer.classList.remove("hide");
        goNextPage();
    }, 500);
};

prevBtn.onclick = () => {
    if (canClick) handleClick(false);
};
nextBtn.onclick = () => {
    if (canClick) handleClick(true);
};

function handleClick(isNext) {
    canClick = false;
    if (isNext) goNextPage();
    else goPrevPage();
    setTimeout(() => {
        canClick = true;
    }, 500);
}

function paperHandler(index) {
    papers.forEach((paper, i) => {
        const front = paper.querySelector('.front');
        const back = paper.querySelector('.back');

        // Reset semua
        front.style.transform = "rotateY(0deg)";
        back.style.transform = "rotateY(0deg)";
        back.style.boxShadow = "none";

        if (index >= 0) {
            if (i === index) {
                front.style.transform = "rotateY(-150deg)";
                back.style.transform = "rotateY(-150deg)";
            }
            else if (i === index - 1) {
                front.style.transform = "rotateY(-160deg) scaleX(1.05)";
                back.style.transform = "rotateY(-160deg) scaleX(1.05)";
            }
            else if (i < index - 1) {
                front.style.transform = "rotateY(-170deg) scaleX(1.1)";
                back.style.transform = "rotateY(-170deg) scaleX(1.1)";
            }

            else if (i === index + 1) {
                front.style.transform = "rotateY(-30deg)";
                back.style.transform = "rotateY(-30deg)";
            }
            else if (i === index + 2) {
                front.style.transform = "rotateY(-20deg) scaleX(1.05)";
                back.style.transform = "rotateY(-20deg) scaleX(1.05)";
            }
            else if (i > index + 2) {
                front.style.transform = "rotateY(-10deg) scaleX(1.1)";
                back.style.transform = "rotateY(-10deg) scaleX(1.1)";
            }
            if (i === index || i === index + 1) {
                back.style.boxShadow = "4px 4px 10px rgba(0, 0, 0, 0.2)";
            }
        }
    });
}
function openBook() {
    book.style.transform = "translateX(50%)";
}

function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";

        papers.forEach((paper, index) => {
            paper.querySelector(".front").style.transform = "rotateY(0deg)";
            paper.querySelector(".back").style.transform = "rotateY(0deg)";

            paper.style.zIndex = papers.length - index;
        });

    } else {
        book.style.transform = "translateX(100%)";

        papers.forEach((paper, index) => {
            paper.querySelector(".front").style.transform = "rotateY(-180deg)";
            paper.querySelector(".back").style.transform = "rotateY(-180deg)";
            paper.style.zIndex = index + 1;
        });
    }
}

function goNextPage() {
    if (currentLocation < paperTotal) {

        const curr = currentLocation;
        let delay = 250;
        if (curr == 0) delay = 300;
        if (curr == paperTotal - 1) delay = 200;

        setTimeout(() => {
            if (papers[curr]) papers[curr].style.zIndex = curr;
        }, delay);

        paperHandler(currentLocation);

        if (currentLocation === paperTotal - 1) {
            closeBook(false);
            pesanBtn.classList.add('show');
        } else {
            openBook();
        }

        currentLocation++;
    }
}

function goPrevPage() {
    if (currentLocation > 0) {
        currentLocation--;

        const curr = currentLocation;
        let delay = 250;
        if (curr == 0) delay = 200;
        if (curr == paperTotal - 1) delay = 300;

        setTimeout(() => {
            if (typeof dataZIndex !== 'undefined' && papers[curr]) {
                papers[curr].style.zIndex = dataZIndex[curr];
            }
        }, delay);

        if (currentLocation > 0) {
            paperHandler(currentLocation - 1);
            openBook();
        } else {
            papers.forEach(p => {
                const front = p.querySelector(".front");
                const back = p.querySelector(".back");
                front.style.transform = "rotateY(0deg)";
                back.style.transform = "rotateY(0deg)";
            });

            closeBook(true);
        }

        if (currentLocation < paperTotal - 1) {
            pesanBtn.classList.remove('show');
        }
    }
}
pesanBtn.onclick = () => {
    Swal.fire({
        title: 'Tulis pesan',
        input: 'textarea',
        confirmButtonText: 'Kirim',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            Swal.fire('Berhasil', 'Pesan terkirim!', 'success');
        }
    });
};

function forceReflow(element) {
    return element.offsetHeight;
}

function optimizeForMobile() {
    document.querySelectorAll('.paper, .front, .back').forEach(el => {
        el.style.transform = 'translate3d(0,0,0)';
    });

    document.addEventListener('touchmove', function (e) {
        if (e.scale !== 1) { e.preventDefault(); }
    }, { passive: false });
}

window.addEventListener('load', function () {
    optimizeForMobile();
});

window.addEventListener('orientationchange', function () {
    setTimeout(optimizeForMobile, 100);
});

let startX = 0;
document.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].screenX;
    if (startX - endX > 50) goNextPage();
    if (endX - startX > 50) goPrevPage();
});
