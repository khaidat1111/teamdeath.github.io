const username = localStorage.getItem('loggedInUser');
if (!username) { window.location.href = 'index.html'; }

document.getElementById('logoutButton').addEventListener('click', function() { 
    localStorage.removeItem('loggedInUser'); 
    window.location.href = 'index.html'; 
});

const menuLinks = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('.content-section');

menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        menuLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
    });
});

let members = JSON.parse(localStorage.getItem('members')) || [
    { avatar: "https://minotar.net/avatar/Hacktivist/80", name: "Hacktivist", rank: "Member", joinDate: "01/04/2025", bio: "Thích chơi PvP và xây dựng trên server Minecraft.", iconUrl: "https://via.placeholder.com/20" },
    { avatar: "https://minotar.net/avatar/Shadow/80", name: "Shadow", rank: "Leader", joinDate: "15/03/2025", bio: "Chuyên tổ chức sự kiện trên server.", iconUrl: "https://via.placeholder.com/20" },
    { avatar: "https://minotar.net/avatar/Cipher/80", name: "Cipher", rank: "Admin", joinDate: "10/02/2025", bio: "Quản lý server và xử lý vi phạm.", iconUrl: "https://via.placeholder.com/20" },
    { avatar: "https://minotar.net/avatar/Neo/80", name: "Neo", rank: "Leader", joinDate: "20/03/2025", bio: "Yêu thích xây dựng và sáng tạo.", iconUrl: "https://via.placeholder.com/20" },
    { avatar: "https://minotar.net/avatar/Zero/80", name: "Zero", rank: "Member", joinDate: "05/04/2025", bio: "Thường xuyên tham gia PvP.", iconUrl: "https://via.placeholder.com/20" }
];

let eventsList = JSON.parse(localStorage.getItem('eventsList')) || [
    "28/05/2025: Cuộc thi CTF Anonymous - 20:00",
    "05/06/2025: Hội thảo An ninh mạng - 15:00",
    "15/06/2025: Gặp mặt cộng đồng - TP.HCM"
];

let announcementsList = JSON.parse(localStorage.getItem('announcementsList')) || [
    "Cập nhật quy tắc cộng đồng: Không chia sẻ công cụ bất hợp pháp.",
    "Server Minecraft bảo trì từ 25/05/2025.",
    "Tham gia Discord để nhận thông tin mới nhất!"
];

let joinGroupsList = JSON.parse(localStorage.getItem('joinGroupsList')) || [
    { text: "Discord Anonymous VN", link: "https://discord.gg/anonymous" },
    { text: "Telegram Anonymous VN", link: "https://t.me/anonymousvn" },
    { text: "GitHub Anonymous", link: "https://github.com/anonymous" }
];

let minecraftList = JSON.parse(localStorage.getItem('minecraftList')) || [
    "play.anonymous.vn:25565 (Hỗ trợ phiên bản 1.16.5 - 1.20.1)"
];

let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

function renderMembers() {
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '';
    members.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('member');
        memberDiv.setAttribute('onclick', `showMemberDetails('${member.name}', '${member.rank}', '${member.joinDate}', '${member.bio}', '${member.iconUrl}')`);
        memberDiv.innerHTML = `
            <img src="${member.avatar}" alt="${member.name}">
            <div class="name-container">
                <img class="name-icon" src="${member.iconUrl}" alt="Icon">
                <p>${member.name}</p>
            </div>
            <div class="rank ${member.rank.toLowerCase()}">${member.rank}</div>
        `;
        membersList.appendChild(memberDiv);
    });
    updateRankSelect();
}

let currentMemberName = '';
function showMemberDetails(name, rank, joinDate, bio, iconUrl) {
    currentMemberName = name;
    document.getElementById('detailAvatar').src = `https://minotar.net/avatar/${name}/100`;
    document.getElementId('detailName').textContent = name;
    document.getElementById('detailRank').textContent = rank;
    document.getElementById('detailJoinDate').textContent = joinDate;
    document.getElementById('detailBio').textContent = bio;
    const editBtn = document.querySelector('.edit-btn');
    const deleteBtn = document.querySelector('.delete-btn');
    const currentUser = members.find(m => m.name === username);
    const targetMember = members.find(m => m.name === name);
    if (username === name || (username === 'admin' && members.some(m => m.name === 'admin' && (m.rank === 'Admin' || m.rank === 'Owner')))) {
        editBtn.style.display = 'block';
    } else {
        editBtn.style.display = 'none';
    }
    if (currentUser && ['Owner', 'Admin', 'Leader'].includes(currentUser.rank) && targetMember && targetMember.rank === 'Member') {
        deleteBtn.style.display = 'block';
    } else {
        deleteBtn.style.display = 'none';
    }
    document.getElementById('memberDetails').classList.add('active');
}

function hideMemberDetails() {
    document.getElementById('memberDetails').classList.remove('active');
    document.getElementById('editMemberForm').style.display = 'none';
}

function toggleEditForm() {
    const form = document.getElementById('editMemberForm');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
    const member = members.find(m => m.name === currentMemberName);
    if (member) {
        document.getElementById('editJoinDate').value = member.joinDate;
        document.getElementById('editBio').value = member.bio;
        document.getElementById('editIconUrl').value = member.iconUrl;
    }
}

function saveMemberDetails() {
    const joinDate = document.getElementById('editJoinDate').value;
    const bio = document.getElementById('editBio').value;
    const iconUrl = document.getElementById('editIconUrl').value;
    const member = members.find(m => m.name === currentMemberName);
    if (member) {
        if (joinDate) member.joinDate = joinDate;
        if (bio) member.bio = bio;
        if (iconUrl) member.iconUrl = iconUrl;
        localStorage.setItem('members', JSON.stringify(members));
        document.getElementById('detailJoinDate').textContent = joinDate;
        document.getElementById('detailBio').textContent = bio;
        renderMembers();
        renderRanks();
        toggleEditForm();
    }
}

function deleteMember() {
    members = members.filter(m => m.name !== currentMemberName);
    localStorage.setItem('members', JSON.stringify(members));
    renderMembers();
    renderRanks();
    hideMemberDetails();
}

function toggleAddMemberForm() {
    const form = document.getElementById('addMemberForm');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function addMember() {
    const avatarUrl = document.getElementById('avatarUrl').value;
    const memberName = document.getElementById('memberName').value;
    if (avatarUrl && memberName) {
        const skinUrl = `https://minotar.net/avatar/${avatarUrl}/80`;
        const joinDate = new Date().toLocaleDateString('en-GB').split('/').join('/');
        members.push({ avatar: skinUrl, name: memberName, rank: "Member", joinDate: joinDate, bio: "Thành viên mới, sẵn sàng khám phá server!", iconUrl: "https://via.placeholder.com/20" });
        localStorage.setItem('members', JSON.stringify(members));
        renderMembers();
        document.getElementById('avatarUrl').value = '';
        document.getElementById('memberName').value = '';
        toggleAddMemberForm();
    }
}

const adminPanel = document.getElementById('adminPanel');
if (username === 'admin' && members.some(m => m.name === 'admin' && (m.rank === 'Admin' || m.rank === 'Owner'))) {
    adminPanel.style.display = 'block';
}

function updateRankSelect() {
    const select = document.getElementById('rankMember');
    select.innerHTML = '<option value="none">Chọn Thành Viên</option>';
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = member.name;
        select.appendChild(option);
    });
}

function assignRank() {
    if (username !== 'admin') return;
    const memberName = document.getElementById('rankMember').value;
    const rankLevel = document.getElementById('rankLevel').value;
    if (memberName !== 'none' && rankLevel) {
        const member = members.find(m => m.name === memberName);
        if (member) {
            member.rank = rankLevel;
            localStorage.setItem('members', JSON.stringify(members));
            renderMembers();
            renderRanks();
        }
    }
}

function postContent() {
    if (username !== 'admin') return;
    const content = document.getElementById('postContent').value;
    const section = document.getElementById('postSection').value;
    if (content) {
        const list = document.getElementById(`${section}List`);
        const li = document.createElement('li');
        if (section === 'join-groups') {
            const a = document.createElement('a');
            a.href = content;
            a.target = '_blank';
            a.textContent = content;
            li.appendChild(a);
            joinGroupsList.push({ text: content, link: content });
            localStorage.setItem('joinGroupsList', JSON.stringify(joinGroupsList));
        } else {
            li.textContent = content;
            if (section === 'events') eventsList.push(content);
            if (section === 'announcements') announcementsList.push(content);
            if (section === 'minecraft-server') minecraftList.push(content);
            localStorage.setItem(`${section}List`, JSON.stringify(eval(`${section}List`)));
        }
        list.appendChild(li);
        document.getElementById('postContent').value = '';
    }
}

function toggleAddForm(section) {
    const form = document.getElementById(`add${section.charAt(0).toUpperCase() + section.slice(1)}Form`);
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function addContent(section) {
    if (!(username === 'admin' && members.some(m => m.name === 'admin' && (m.rank === 'Admin' || m.rank === 'Owner')))) return;
    const input = document.getElementById(`${section}Input`);
    const content = input.value;
    if (content) {
        const list = document.getElementById(`${section}List`);
        const li = document.createElement('li');
        if (section === 'join-groups') {
            const a = document.createElement('a');
            a.href = content;
            a.target = '_blank';
            a.textContent = content;
            li.appendChild(a);
            joinGroupsList.push({ text: content, link: content });
            localStorage.setItem('joinGroupsList', JSON.stringify(joinGroupsList));
        } else {
            li.textContent = content;
            if (section === 'events') eventsList.push(content);
            if (section === 'announcements') announcementsList.push(content);
            if (section === 'minecraft-server') minecraftList.push(content);
            localStorage.setItem(`${section}List`, JSON.stringify(eval(`${section}List`)));
        }
        list.appendChild(li);
        input.value = '';
        toggleAddForm(section);
    }
}

function renderRanks() {
    const ranksList = document.getElementById('ranksList');
    ranksList.innerHTML = '';
    members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = `${member.name} - ${member.rank}`;
        ranksList.appendChild(li);
    });
}

function renderChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    chatMessages.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('chat-message');
        div.innerHTML = `<span>${msg.user}:</span> ${msg.text}`;
        chatContainer.appendChild(div);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (text) {
        chatMessages.push({ user: username, text: text });
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        renderChat();
        input.value = '';
    }
}

document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function changeTheme(theme) {
    const body = document.body;
    body.classList.remove('light', 'dark', 'rgb');
    body.classList.add(theme);
    localStorage.setItem('theme', theme);
    if (theme === 'rgb') {
        body.style.background = '';
        body.querySelector('canvas').style.display = 'block';
    } else if (theme === 'light') {
        body.querySelector('canvas').style.display = 'none';
    } else {
        body.querySelector('canvas').style.display = 'block';
    }
}

function changeSidebarPosition(position) {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.remove('top', 'left', 'right');
    mainContent.classList.remove('top', 'left', 'right');
    sidebar.classList.add(position);
    mainContent.classList.add(position);
    localStorage.setItem('sidebarPosition', position);
}

function changePrimaryColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    localStorage.setItem('primaryColor', color);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
const savedSidebarPosition = localStorage.getItem('sidebarPosition') || 'left';
const savedPrimaryColor = localStorage.getItem('primaryColor') || '#1e90ff';
changeTheme(savedTheme);
changeSidebarPosition(savedSidebarPosition);
changePrimaryColor(savedPrimaryColor);
document.querySelector(`input[name="theme"][value="${savedTheme}"]`).checked = true;
document.querySelector(`input[name="sidebar"][value="${savedSidebarPosition}"]`).checked = true;
document.getElementById('primaryColor').value = savedPrimaryColor;

renderMembers();
renderChat();

function renderSectionList(section, list) {
    const sectionList = document.getElementById(`${section}List`);
    sectionList.innerHTML = '';
    list.forEach(item => {
        const li = document.createElement('li');
        if (section === 'join-groups') {
            const a = document.createElement('a');
            a.href = item.link;
            a.target = '_blank';
            a.textContent = item.text;
            li.appendChild(a);
        } else {
            li.textContent = item;
        }
        sectionList.appendChild(li);
    });
}

renderSectionList('events', eventsList);
renderSectionList('announcements', announcementsList);
renderSectionList('join-groups', joinGroupsList);
renderSectionList('minecraft-server', minecraftList);
renderRanks();

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 150;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});