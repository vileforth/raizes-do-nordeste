export type SeedProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
};

export const SEED_PRODUCTS: SeedProduct[] = [
  { id: 1, name: 'Baião Burger', description: 'Hambúrguer com carne de sol, queijo coalho e vinagrete.', price: 34.9, category: 'Hambúrguer', active: true },
  { id: 2, name: 'Sertão Smash', description: 'Smash burger com queijo coalho e molho de pimenta biquinho.', price: 29.9, category: 'Hambúrguer', active: true },
  { id: 3, name: 'Burger de Costela', description: 'Costela desfiada, cebola crispy e maionese de alho.', price: 36.9, category: 'Hambúrguer', active: true },
  { id: 4, name: 'Cheddar Nordestino', description: 'Blend bovino, cheddar cremoso e bacon de carne de sol.', price: 32.9, category: 'Hambúrguer', active: true },
  { id: 5, name: 'Veggie de Feijão', description: 'Hambúrguer de feijão-de-corda, rúcula e vinagrete.', price: 27.9, category: 'Hambúrguer', active: true },
  { id: 6, name: 'Frango do Terreiro', description: 'Frango grelhado, queijo coalho e molho de caju.', price: 28.9, category: 'Hambúrguer', active: true },
  { id: 7, name: 'Duplo Sertanejo', description: 'Dois blends, queijo coalho, bacon e molho da casa.', price: 38.9, category: 'Hambúrguer', active: true },
  { id: 8, name: 'Mini Burger Rapadura', description: 'Versão kids com queijo, batata e suco natural.', price: 19.9, category: 'Hambúrguer', active: true },
  { id: 9, name: 'Tapioca de Carne de Sol', description: 'Tapioca recheada com carne de sol e queijo coalho.', price: 18.9, category: 'Lanche', active: true },
  { id: 10, name: 'Tapioca de Queijo Coalho', description: 'Tapioca na chapa com queijo coalho e manteiga de garrafa.', price: 16.9, category: 'Lanche', active: true },
  { id: 11, name: 'Sanduíche de Pernil', description: 'Pernil assado, vinagrete e pão de leite.', price: 22.9, category: 'Lanche', active: true },
  { id: 12, name: 'Pastel de Camarão', description: 'Pastel crocante de camarão com catupiry.', price: 14.9, category: 'Lanche', active: true },
  { id: 13, name: 'Coxinha de Frango', description: 'Coxinha cremosa de frango com catupiry.', price: 9.9, category: 'Lanche', active: true },
  { id: 14, name: 'Esfirra de Carne', description: 'Esfirra assada de carne temperada com cominho.', price: 8.9, category: 'Lanche', active: true },
  { id: 15, name: 'Cachorro-quente Nordestino', description: 'Salsicha, vinagrete, milho e batata palha.', price: 16.9, category: 'Lanche', active: true },
  { id: 16, name: 'Misto de Queijo Coalho', description: 'Pão de forma, queijo coalho e orégano na chapa.', price: 14.9, category: 'Lanche', active: true },
  { id: 17, name: 'Suco de Caju 500ml', description: 'Suco natural de caju, sem açúcar adicionado.', price: 9.9, category: 'Bebida', active: true },
  { id: 18, name: 'Suco de Acerola 500ml', description: 'Suco natural de acerola batido na hora.', price: 9.9, category: 'Bebida', active: true },
  { id: 19, name: 'Suco de Umbu 500ml', description: 'Suco de umbu típico do sertão.', price: 10.9, category: 'Bebida', active: true },
  { id: 20, name: 'Água de Coco 400ml', description: 'Água de coco gelada servida no copo.', price: 8.9, category: 'Bebida', active: true },
  { id: 21, name: 'Refrigerante Lata 350ml', description: 'Lata gelada de refrigerante.', price: 6.9, category: 'Bebida', active: true },
  { id: 22, name: 'Água Mineral 500ml', description: 'Água mineral sem gás.', price: 4.9, category: 'Bebida', active: true },
  { id: 23, name: 'Guaraná Jesus Lata', description: 'Guaraná Jesus gelado, clássico do Maranhão.', price: 7.9, category: 'Bebida', active: true },
  { id: 24, name: 'Café com Rapadura', description: 'Café coado adoçado com rapadura.', price: 6.5, category: 'Bebida', active: true },
  { id: 25, name: 'Cartola', description: 'Banana frita, queijo coalho, canela e rapadura.', price: 16.9, category: 'Sobremesa', active: true },
  { id: 26, name: 'Bolo de Rolo', description: 'Fatia de bolo de rolo de goiabada.', price: 12.9, category: 'Sobremesa', active: true },
  { id: 27, name: 'Pudim de Leite', description: 'Pudim cremoso com calda de caramelo.', price: 11.9, category: 'Sobremesa', active: true },
  { id: 28, name: 'Açaí 300ml', description: 'Açaí batido com granola e banana.', price: 14.9, category: 'Sobremesa', active: true },
  { id: 29, name: 'Cocada Cremosa', description: 'Cocada mole servida quente.', price: 10.9, category: 'Sobremesa', active: true },
  { id: 30, name: 'Queijadinha', description: 'Queijadinha assada de coco e queijo.', price: 8.9, category: 'Sobremesa', active: true },
  { id: 31, name: 'Sorvete de Tapioca', description: 'Bola de sorvete artesanal de tapioca.', price: 13.9, category: 'Sobremesa', active: true },
  { id: 32, name: 'Batata Frita', description: 'Porção de batata frita crocante.', price: 12.9, category: 'Acompanhamento', active: true },
  { id: 33, name: 'Macaxeira Frita', description: 'Porção de macaxeira frita com manteiga de garrafa.', price: 13.9, category: 'Acompanhamento', active: true },
  { id: 34, name: 'Mandioca com Carne de Sol', description: 'Mandioca cozida e carne de sol na nata.', price: 18.9, category: 'Acompanhamento', active: true },
  { id: 35, name: 'Onion Rings', description: 'Anéis de cebola empanados.', price: 14.9, category: 'Acompanhamento', active: true },
  { id: 36, name: 'Farofa de Dendê', description: 'Farofa amarela com dendê e bacon.', price: 8.9, category: 'Acompanhamento', active: true },
  { id: 37, name: 'Salada de Vinagrete', description: 'Tomate, cebola, pimentão e coentro.', price: 7.9, category: 'Acompanhamento', active: true },
  { id: 38, name: 'Porção de Queijo Coalho', description: 'Queijo coalho grelhado com orégano e mel de engenho.', price: 16.9, category: 'Acompanhamento', active: true },
  { id: 39, name: 'Combo Sertão', description: 'Baião Burger, batata frita e refrigerante lata.', price: 42.9, category: 'Combo', active: true },
  { id: 40, name: 'Combo Tapioca', description: 'Tapioca de carne de sol e suco de caju.', price: 26.9, category: 'Combo', active: true },
  { id: 41, name: 'Combo Duplo Sertão', description: 'Dois smash burgers, macaxeira e duas bebidas.', price: 47.9, category: 'Combo', active: true },
  { id: 42, name: 'Combo Kids', description: 'Mini burger, batata pequena e suco.', price: 24.9, category: 'Combo', active: true },
  { id: 43, name: 'Combo Executivo', description: 'Sanduíche de pernil, vinagrete e suco de acerola.', price: 39.9, category: 'Combo', active: true },
  { id: 44, name: 'Combo Doce', description: 'Cartola e café com rapadura.', price: 21.9, category: 'Combo', active: true },
  { id: 45, name: 'Combo Praia', description: 'Sanduíche de pernil e água de coco.', price: 29.9, category: 'Combo', active: true },
];
