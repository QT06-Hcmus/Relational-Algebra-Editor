/**
 * Relational Algebra Editor Logic (Subscript rendering edition)
 */

// Chèn ký hiệu hoặc chỉ số dưới tại vị trí con trỏ trong contenteditable
function insertAtCursor(text, isSubscript = false, cursorOffset) {
    const editor = document.getElementById('editor');
    if (!editor) return;

    editor.focus();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    if (isSubscript) {
        // Tạo node ký hiệu chính (ví dụ: σ, π)
        const symbolNode = document.createTextNode(text);
        range.insertNode(symbolNode);

        // Tạo thẻ sub (chỉ số dưới) ngay sau ký hiệu chính
        const subNode = document.createElement('sub');
        // Sử dụng Zero-Width Space (U+200B) để trình duyệt cho phép con trỏ nhảy vào trong thẻ sub rỗng
        subNode.innerHTML = '&#8203;'; 
        
        range.setStartAfter(symbolNode);
        range.insertNode(subNode);

        // Đưa con trỏ chuột vào bên trong thẻ sub (sau ký tự zero-width space)
        const newRange = document.createRange();
        newRange.setStart(subNode, 1);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
    } else {
        // Chèn văn bản thông thường
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Thiết lập vị trí con trỏ sau khi chèn
        const newRange = document.createRange();
        if (typeof cursorOffset === 'number') {
            newRange.setStart(textNode, cursorOffset);
        } else {
            newRange.setStartAfter(textNode);
        }
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
    }
}

// Chuyển đổi nội dung HTML của editor thành Plain Text (thay <sub> thành _{})
function getEditorPlainText() {
    const editor = document.getElementById('editor');
    if (!editor) return '';

    const clone = editor.cloneNode(true);

    // Tìm và đổi các thẻ sub <sub>nội dung</sub> thành _{nội dung}
    const subs = clone.getElementsByTagName('sub');
    for (let i = subs.length - 1; i >= 0; i--) {
        const sub = subs[i];
        let textContent = sub.textContent;
        // Xóa ký tự Zero-Width Space nếu có
        textContent = textContent.replace(/\u200B/g, '');
        
        const textNode = document.createTextNode(`_{${textContent}}`);
        sub.parentNode.replaceChild(textNode, sub);
    }

    // Chuyển đổi các thẻ xuống dòng phổ biến của contenteditable thành ký tự xuống dòng \n
    let html = clone.innerHTML;
    html = html.replace(/<div>/gi, '\n').replace(/<\/div>/gi, '');
    html = html.replace(/<p>/gi, '\n').replace(/<\/p>/gi, '');
    html = html.replace(/<br\s*\/?>/gi, '\n');

    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Lấy plain text và loại bỏ các ký tự ẩn
    let plainText = temp.textContent;
    plainText = plainText.replace(/\u200B/g, '');

    return plainText;
}

// Sao chép nội dung đã định dạng dưới dạng plain text
function copyText() {
    const text = getEditorPlainText();
    if (!text.trim()) {
        alert('Không có nội dung để sao chép!');
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Đã sao chép biểu thức (dạng plain text: _{}) vào Clipboard!');
        })
        .catch(err => {
            alert('Không thể sao chép: ' + err);
        });
}

// Xóa sạch nội dung soạn thảo
function clearText() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    if (!editor.textContent.trim()) {
        editor.innerHTML = '';
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ nội dung hiện tại không?')) {
        editor.innerHTML = '';
        editor.focus();
    }
}

// Lưu HTML hiện tại vào localStorage
function saveText() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    localStorage.setItem('relational_algebra_editor_html_v2', editor.innerHTML);
    alert('Đã lưu nội dung thành công vào bộ nhớ trình duyệt!');
}

// Tải HTML từ localStorage
function loadText() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    const savedHtml = localStorage.getItem('relational_algebra_editor_html_v2');
    if (savedHtml !== null) {
        if (editor.textContent.trim() && !confirm('Tải nội dung đã lưu sẽ ghi đè lên nội dung hiện tại. Tiếp tục?')) {
            return;
        }
        editor.innerHTML = savedHtml;
        editor.focus();
    } else {
        alert('Không tìm thấy dữ liệu đã lưu trước đó!');
    }
}

// Tải xuống file .txt (định dạng plain text chuẩn)
function downloadTxt() {
    const text = getEditorPlainText();
    if (!text.trim()) {
        alert('Không có nội dung để tải xuống!');
        return;
    }

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'dai_so_quan_he.txt';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Kích hoạt tính năng in
function printPage() {
    window.print();
}

// Thay đổi cỡ chữ của editor
function changeFontSize(size) {
    const editor = document.getElementById('editor');
    if (editor) {
        editor.style.fontSize = size;
        localStorage.setItem('relational_algebra_font_size', size);
    }
}

// Lắng nghe sự kiện bàn phím trên editor để hỗ trợ phím Tab và phím di chuyển
window.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    if (!editor) return;

    // Tự động khôi phục dữ liệu cũ nếu có
    const savedHtml = localStorage.getItem('relational_algebra_editor_html_v2');
    if (savedHtml) {
        editor.innerHTML = savedHtml;
    }

    // Tự động khôi phục cỡ chữ cũ nếu có
    const savedFontSize = localStorage.getItem('relational_algebra_font_size');
    if (savedFontSize) {
        editor.style.fontSize = savedFontSize;
        const select = document.getElementById('font-size-select');
        if (select) {
            select.value = savedFontSize;
        }
    }

    editor.addEventListener('keydown', function(e) {
        const sel = window.getSelection();
        if (sel.rangeCount === 0) return;

        const range = sel.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;
        let container = startContainer;

        // Nhấn Tab hoặc Mũi tên Phải để thoát chỉ số dưới sang bên phải
        if (e.key === 'Tab' || e.key === 'ArrowRight') {
            let insideSub = false;
            let subNode = null;
            let temp = container;
            while (temp && temp !== editor) {
                if (temp.nodeName === 'SUB') {
                    insideSub = true;
                    subNode = temp;
                    break;
                }
                temp = temp.parentNode;
            }

            if (insideSub && subNode) {
                let isAtEnd = false;
                if (startContainer.nodeType === Node.TEXT_NODE) {
                    isAtEnd = (startOffset === startContainer.length);
                } else {
                    isAtEnd = (startOffset === startContainer.childNodes.length);
                }

                if (isAtEnd) {
                    e.preventDefault(); // Chặn hành vi mặc định
                    
                    // Sử dụng thẻ span chứa ký tự zero-width space để tránh trình duyệt tự động gộp text gõ mới vào lại thẻ sub
                    let nextNode = subNode.nextSibling;
                    if (!nextNode || nextNode.nodeName !== 'SPAN') {
                        nextNode = document.createElement('span');
                        nextNode.innerHTML = '&#8203;';
                        subNode.parentNode.insertBefore(nextNode, subNode.nextSibling);
                    }

                    const newRange = document.createRange();
                    newRange.setStart(nextNode.firstChild, 1);
                    newRange.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }
            }
        }

        // Nhấn Mũi tên Trái để thoát chỉ số dưới sang bên trái
        if (e.key === 'ArrowLeft') {
            let insideSub = false;
            let subNode = null;
            let temp = container;
            while (temp && temp !== editor) {
                if (temp.nodeName === 'SUB') {
                    insideSub = true;
                    subNode = temp;
                    break;
                }
                temp = temp.parentNode;
            }

            if (insideSub && subNode) {
                let isAtStart = false;
                if (startContainer.nodeType === Node.TEXT_NODE) {
                    isAtStart = (startOffset === 0) || (startOffset === 1 && startContainer.textContent.startsWith('\u200B'));
                } else {
                    isAtStart = (startOffset === 0);
                }

                if (isAtStart) {
                    e.preventDefault(); // Chặn hành vi mặc định

                    // Sử dụng thẻ span chứa ký tự zero-width space để đứng trước thẻ sub
                    let prevNode = subNode.previousSibling;
                    if (!prevNode || prevNode.nodeName !== 'SPAN') {
                        prevNode = document.createElement('span');
                        prevNode.innerHTML = '&#8203;';
                        subNode.parentNode.insertBefore(prevNode, subNode);
                    }

                    const newRange = document.createRange();
                    newRange.setStart(prevNode.firstChild, 1);
                    newRange.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }
            }
        }
    });
});
