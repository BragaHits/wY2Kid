document.addEventListener("alpine:init", () => {
  Alpine.data("product", () => ({
    items: [
      { id: 1, name: "Nightmare Baggy Jeans", img: "1.jpg", price: 699000 },
      { id: 2, name: "Y2K Multi Zipper", img: "2.jpg", price: 475000 },
      { id: 3, name: "Soft Seoul Brown y2k", img: "3.jpg", price: 455000 },
      { id: 4, name: "y2k Jorst Volcano`s", img: "4.jpg", price: 299000 },
      { id: 5, name: "Vintage Jorst Washed", img: "11.jpg", price: 499000 },
      { id: 6, name: "Zipper Hoodie Boxy", img: "12.jpg", price: 300000 },
      { id: 7, name: "Drugs Zipper Hoodie", img: "10.jpg", price: 899000 },
      { id: 8, name: "Reavenism Wool Flanel Jacket", img: "5.jpg", price: 375000 },
      { id: 9, name: "Reaven Misanthropia T-Shirt", img: "6.jpg", price: 255000 },
      { id: 10, name: "y2k VeA Belt", img: "9.jpg", price: 299000 },
      { id: 11, name: "Vans KNU Skool", img: "7.jpg", price: 899000 },
      { id: 12, name: "Nike Air Max TN Dracula", img: "8.jpg", price: 999000 },
    ],
  }));

  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
// cek apakah ada barang yang sama di cart
const cartItem = this.items.find((item) => item.id === newItem.id);

// jika belum / cart kosong
if(!cartItem) {
      this.items.push({...newItem, quantity: 1, total: newItem.price});
      this.quantity++;
      this.total += newItem.price;
    } else {
        // jika barang sudah ada, cek apakah barang beda atau sanna dengan yang ada di cart
        this.items = this.items.map((item) => {
        // jika barang berbeda
        if(item.id !== newItem.id) {
            return item;
        } else {
        // jika barang sudah ada, tambah quantity dan totalnya
        item.quantity++;
        item.total = item.price * item.quantity
        this.quantity++;
        this.total += item.price;
        return item;
        }
        });
     }
    },
    remove(id) {
        // ambil item yang mau diremove berdasarkan id nya
        const cartItem = this.items.find((item) => item.id === id);

        // jika item lebih dari 1
        if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
        // jika bukan barang yang diklik
        if (item.id !== id) {
            return item;
        } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
        }
      });
     } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
     }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for(let i = 0; i <form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
});

// minta transaction token menggunakan ajax / fetch

try {
    const response = await fetch('php/placeOrder.php', {
        method: 'POST',
        body: data,
    });
    const token = await response.text();
    // console.log(token)
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// untuk format pesan whatsapp
const formatMessage = (obj) => {
    return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No Hp: ${obj.phone}
Data pesanan
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.
        total)}) \n`)}
TOTAL: ${rupiah(obj.total)}
ThankYou`;
}

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
