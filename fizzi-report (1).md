# Fizzi — отчёт по тестированию и рекомендации

**Сайт:** https://fizzi-anton.vercel.app/
**Стек (виден в бандле):** Next.js 16, Prismic, GSAP, React Three Fiber / three.js
**Где проверялось:** вручную в Chrome (десктоп 1532×881 и узкое окно 389×662, без эмуляции тача) и автоматически в Lighthouse (мобильный профиль). Эталона для сравнения нет.

**Содержание:**

1. Найденные проблемы (ручной тест)
2. Lighthouse
3. С чего начать
4. Технические рекомендации: 4.1 баги из таблицы · 4.2 производительность · 4.3 доступность · 4.4 безопасность · 4.5 можно не трогать
5. UI/UX-рекомендации
6. Чеклист перед релизом

**Как читать:** «(п.2)» — строка таблицы из раздела 1. Метки в рекомендациях показывают порядок работ, а не серьёзность бага: 🔴 сделать сразу · 🟡 желательно · ⚪ когда будет время. Поэтому быстрый LOW-баг вроде мета-тегов может стоять с 🔴.

---

## 1. Найденные проблемы (ручной тест)

| №   | Приоритет | Проблема                                                                                                                                                                                                                                     | Шаги воспроизведения                                                                                                                                                                                                                              |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | HIGH      | Кнопка «SHOP NOW» на первом экране ничего не делает — ни перехода, ни прокрутки.<br><br>Другого пути к покупке на сайте нет: в «Choose Your Flavor» только цена «12 cans - $35.99», без кнопки.                                              | 1. Открыть https://fizzi-anton.vercel.app/.<br>2. Нажать «SHOP NOW».<br>3. URL остаётся `/`, страница не меняется. У ссылки `href=""`.                                                                                                            |
| 2   | MEDIUM    | Мобильный: в блоках про состав текст лежит прямо на 3D-банке — тёмные буквы на розовой банке почти не читаются.                                                                                                                              | 1. Окно 389px → `/` → прокрутить до «Gut-Friendly Goodness».<br>2. Заголовок и абзац «Our soda is packed with prebiotics…» поверх банки.<br>3. Так же в «Light Calories, Big Flavor» и «Naturally Refreshing». На десктопе банка сбоку от текста. |
| 3   | LOW       | Между «Dive into better health» и «Choose Your Flavor» почти экран пустого голубого фона: банка улетает, а следующий блок появляется с задержкой.<br><br>На мобильном ещё ~⅔ экрана пустого жёлтого фона под текстом «Try all five flavors». | 1. `/` → прокручивать колесом до надписи «DIVE INTO BETTER HEALTH».<br>2. Прокручивать дальше, пока банка не уйдёт с экрана.<br>3. Десктоп: при `scrollY` ≈ 3400–3800 только фон, «Choose Your Flavor» начинается с 4683.                         |
| 4   | LOW       | Мобильный: в блоке «Dive into better health» банка крупнее экрана — обрезана по краям и закрывает сам заголовок.                                                                                                                             | 1. Окно 389px → `/` → прокрутить до `scrollY` ≈ 2000.<br>2. Банка выходит за левый и правый край, слова «DIVE», «INTO», «BETTER» видны частично за ней.                                                                                           |
| 5   | LOW       | Мобильный: надпись «SODA THAT MAKES YOU SMILE» шире окна на 15px (`w-screen` = 100vw с учётом скроллбара) — последние буквы уходят под скроллбар.                                                                                            | 1. Окно 389px → `/` → прокрутить в самый низ.<br>2. Секция и строки `text-[34vw]` заканчиваются на 389px при ширине контента 374px, «A» и «S» у края обрезаны.                                                                                    |
| 6   | LOW       | Логотип «fizzi» в шапке выглядит кликабельным (курсор-рука), но это не ссылка.                                                                                                                                                               | 1. `/` → навести на логотип в шапке: курсор `pointer`.<br>2. Кликнуть — перехода нет.                                                                                                                                                             |
| 7   | LOW       | Страница 404 — стандартная заглушка Next.js на чёрном фоне: тёмно-синий логотип почти не виден, ссылки на главную нет.                                                                                                                       | 1. Открыть `/shop` (любой несуществующий путь).<br>2. Чёрный экран «404 This page could not be found.», логотип `#075985` на `#000`, ссылок нет.                                                                                                  |
| 8   | LOW       | У главной нет `<title>`, meta description и og-тегов: во вкладке и в поиске вместо названия адрес сайта, превью при шеринге пустое.                                                                                                          | 1. Открыть `/` → название вкладки «fizzi-anton.vercel.app».<br>2. DevTools → `<head>`: нет `<title>`, `meta[name=description]`, `og:*`.                                                                                                           |
| 9   | LOW       | В консоли при каждой загрузке остаётся отладочный вывод `-1.3089969389957472`.                                                                                                                                                               | 1. DevTools → Console → перезагрузить `/`.<br>2. Строка `-1.3089969389957472` из `2bwbvpp_y7_9a.js`.                                                                                                                                              |

**Проверено:**

- все блоки главной с прокруткой (десктоп и 389px), страница 404;
- «SHOP NOW», логотип;
- карусель «Choose Your Flavor» по кругу в обе стороны, быстрые клики, стрелки на мобильном;
- консоль, `<head>` и мета-теги, горизонтальный скролл (его нет), видимость фокуса с клавиатуры;
- Lighthouse, мобильный профиль (раздел 2).

**Не проверено:** нажатия пальцем и свайпы (окно просто сужено, тача нет), поворот экрана, Safari на iOS, другие браузеры, скорость на реальных устройствах (есть только эмуляция Lighthouse).

Один раз на ширине 389px страница не прокручивалась ни колесом, ни клавишей PageDown. Со второй загрузки всё работало, повторить не удалось, поэтому в таблицу это не вошло.

---

## 2. Lighthouse

Lighthouse 13.4.1, мобильный профиль (эмуляция Moto G Power, Slow 4G), 28.09.2026.

| Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
| :---------: | :-----------: | :------------: | :-: | :--------------: |
|     90      |      91       |      100       | 82  |       1/2        |

|  FCP  |  LCP  |    TBT     | CLS | Speed Index |
| :---: | :---: | :--------: | :-: | :---------: |
| 1,0 с | 1,9 с | **340 мс** |  0  |  **4,2 с**  |

Главные потери: SEO (нет `<title>` и description) и TBT — основной поток занят JavaScript (выполнение JS 2,0 с, вся работа основного потока 3,2 с, 9 долгих задач).

**Совпало с ручным тестом:**

- нет `<title>` и meta description (п.8) — минус сразу в SEO, Accessibility и Agentic Browsing;
- дублирующийся `id="fizzi-logo-title"` в SVG логотипа.

**Нашёл только Lighthouse** (как исправить — в разделе 4):

| Замечание                                                  | Потеря      | Где исправление                |
| ---------------------------------------------------------- | ----------- | ------------------------------ |
| Неиспользуемый JS в чанках 3D-сцен                         | 542 КиБ     | 4.2 «3D и JavaScript»          |
| Картинка банок на мобильном 1603×1791 вместо 380×425       | 70 КиБ      | 4.2 «Картинка первого экрана»  |
| `cloud.png` с GitHub (кэш 5 мин) и Draco-декодер с gstatic | 91 + 99 КиБ | 4.2 «Сторонние файлы»          |
| Чёрный кадр перед первым экраном (плёнка, Slow 4G)         | —           | 4.2 «Чёрный кадр при загрузке» |
| Жёлтый на оранжевом в «SODA THAT MAKES YOU SMILE»          | контраст    | 4.3 «Контраст»                 |
| Нет CSP, COOP, защиты от фреймов (без влияния на оценку)   | —           | 4.4                            |

---

## 3. С чего начать

| #   | Что                                                                 | Время  |
| --- | ------------------------------------------------------------------- | ------ |
| 1   | Починить «SHOP NOW» и сделать из карусели «вкус + покупка»          | 1–2 ч  |
| 2   | Развести текст и 3D-банку на мобильном                              | 1–2 ч  |
| 3   | Прописать `<title>`, description, og-теги                           | 20 мин |
| 4   | Убрать `console.log`, сделать свою 404                              | 30 мин |
| 5   | Липкая кнопка покупки на мобильном                                  | 30 мин |
| 6   | Ленивая загрузка 3D-секций (−542 КиБ JS) и `sizes` у картинки героя | 1–2 ч  |

---

## 4. Технические рекомендации

### 4.1 Баги из таблицы

#### 🔴 «SHOP NOW» не работает (п.1)

У ссылки `href=""`, то есть поле ссылки в Prismic пустое. Заполните его в Prismic и не выводите кнопку без ссылки. Пока магазина нет, пусть кнопка ведёт хотя бы к выбору вкуса:

```tsx
import { isFilled } from "@prismicio/client";

{
  isFilled.link(slice.primary.cta_button_link) ? (
    <PrismicNextLink field={slice.primary.cta_button_link} className="hero-button …">
      {slice.primary.cta_button_text}
    </PrismicNextLink>
  ) : (
    <a href="#flavors" className="hero-button …">
      Shop now
    </a>
  );
}
```

Как сделать саму покупку в карусели — в разделе 5 «Превратить карусель во „вкус + покупка“».

#### 🔴 Мобильный: текст лежит на банке (п.2)

В «Gut-Friendly Goodness», «Light Calories…» и «Naturally Refreshing» заголовок и абзац стоят прямо поверх 3D-банки. У вас уже есть `gsap.matchMedia` с `isDesktop` / `isMobile`, так что на мобильном банку можно уменьшить и сдвинуть под текст:

```ts
mm.add({ isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" }, (ctx) => {
  const { isMobile } = ctx.conditions!;
  canRef.current.scale.setScalar(isMobile ? 0.55 : 1);
  canRef.current.position.y = isMobile ? -1.6 : 0; // ниже текста
});
```

Если хочется оставить банку за текстом, дайте тексту подложку:

```tsx
<div className="relative z-10 max-md:rounded-2xl max-md:bg-yellow-300/85 max-md:p-4 max-md:backdrop-blur">
```

#### 🟡 Пустые экраны (п.3)

После пролёта банки около экрана пустого голубого фона (десктоп, `scrollY` ≈ 3400–3800), а на мобильном ещё около ⅔ экрана пустого жёлтого фона под «Try all five flavors». Уменьшите длину pin, у пина сейчас `padding-bottom: 2000px`:

```ts
scrollTrigger: { trigger: ".skydive", pin: true, start: "top top", end: "+=1200", scrub: 1.5 }
```

#### 🟡 Мобильный: банка в «Dive into better health» больше экрана (п.4)

Она обрезана по краям и закрывает заголовок. Сделайте масштаб от ширины экрана в том же `matchMedia`:

```ts
const s = isDesktop ? 1 : Math.min(1, window.innerWidth / 700);
canRef.current.scale.setScalar(s);
```

#### ⚪ «SODA THAT MAKES YOU SMILE» шире экрана (п.5)

`w-screen` = `100vw` и включает ширину скроллбара, отсюда лишние 15px справа. Замените на `w-full`:

```diff
- <section className="min-h-screen w-screen overflow-hidden bg-[#fe6334]">
+ <section className="min-h-screen w-full overflow-hidden bg-[#fe6334]">
```

#### ⚪ Логотип в шапке — не ссылка (п.6)

Курсор-рука есть, а ссылки нет. Оберните логотип в ссылку:

```tsx
<Link href="/" aria-label="Fizzi — на главную">
  <FizziLogo className="h-20 text-sky-800" />
</Link>
```

#### 🟡 Своя страница 404 (п.7)

Сейчас это стандартная чёрная заглушка Next.js: тёмно-синий логотип на ней почти не виден, ссылки домой нет.

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center gap-6 bg-yellow-300 text-center">
      <h1 className="text-5xl font-black">Такой страницы нет</h1>
      <Link href="/" className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white">
        На главную
      </Link>
    </main>
  );
}
```

#### 🔴 Мета-теги (п.8)

Задайте значения по умолчанию в `app/layout.tsx`, а для страниц берите их из Prismic:

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://fizzi-anton.vercel.app"),
  title: { default: "Fizzi — пребиотическая газировка", template: "%s · Fizzi" },
  description: "3–5 г сахара, 9 г клетчатки, 5 вкусов.",
  openGraph: { images: ["/og.png"] },
};
```

```tsx
// app/page.tsx — если в Prismic есть поля meta_title / meta_description
export async function generateMetadata(): Promise<Metadata> {
  const page = await createClient().getSingle("homepage");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: { images: [page.data.meta_image?.url ?? "/og.png"] },
  };
}
```

#### 🟡 Чистая консоль (п.9)

В компоненте skydive `console.log(r)` печатает угол `-1.3089…` при каждой загрузке. Удалите его и включите правило линтера:

```js
// eslint.config.mjs
rules: { "no-console": ["error", { allow: ["warn", "error"] }] }
```

Ещё в консоли есть предупреждение `THREE.Clock: This module has been deprecated`. Оно идёт из three/R3F, и его уберёт обновление `@react-three/fiber` и `@react-three/drei` до версий под ваш `three`.

### 4.2 Производительность

#### 🟡 3D и JavaScript: грузить позже

Вес ресурсов ~3,8 МБ (без сжатия), из них JS ~2,7 МБ; по Lighthouse 542 КиБ JS на первом экране не используется. Больше всего в чанках `3da24lvsx9n-y.js` (184 КиБ из 244), `2_53tp9td4gyy.js` (172 из 179) и `0-3fdzbexgwrf.js` (105 из 237) — это код 3D-сцен и анимаций ниже первого экрана. Модели и HDR лёгкие, основной вес — код.

Секции skydive, карусели и alternating text подключайте лениво:

```tsx
const Skydive = dynamic(() => import("./SkyDive"), { ssr: false });
```

Проверить, что именно лежит в чанках:

```bash
ANALYZE=true npx next build   # с @next/bundle-analyzer в next.config
```

#### 🟡 Картинка первого экрана в 4 раза больше нужного

`img.w-full.md:hidden` (банки на мобильном) грузится из Prismic в 1603×1791, а показывается в 380×425. Потеря 70 КиБ. Отдайте картинку с `sizes`:

```tsx
import { PrismicNextImage } from "@prismicio/next";

<PrismicNextImage
  field={slice.primary.cans_image} // ваше поле картинки
  sizes="(min-width: 768px) 0px, 100vw"
  priority
  className="w-full md:hidden"
/>;
```

`priority` — потому что это первый экран на мобильном: картинка должна грузиться сразу.

#### 🟡 Сторонние файлы: облако и Draco-декодер

- `cloud.png` (91 КиБ) идёт с `raw.githubusercontent.com` с кэшем на 5 минут. Это текстура по умолчанию у `<Clouds>` из drei. Положите файл в `public/` и передайте явно:

```tsx
<Clouds texture="/cloud.png">…</Clouds>
```

- `draco_decoder.wasm` и `draco_wasm_wrapper.js` (99 КиБ) идут с `gstatic.com` — это путь по умолчанию у `useGLTF`. Работает, но лучше держать у себя:

```ts
useGLTF.preload("/Soda-can.gltf", "/draco/"); // скопировать node_modules/three/examples/jsm/libs/draco/ в public/draco/
```

#### ⚪ Чёрный кадр при загрузке

На плёнке Lighthouse (Slow 4G) между белыми кадрами и первым экраном мелькает чёрный кадр. Задайте жёлтый фон сразу на `<html>`, чтобы до гидрации не было чёрного:

```tsx
// app/layout.tsx
<html lang="en" className="bg-yellow-300">
```

Если чёрный экран — это ваш собственный лоадер, перекрасьте его в цвет первого экрана.

### 4.3 Доступность

#### ⚪ Дублирующиеся `id` в SVG логотипа

`fizzi-logo-title`, `clip0_342_66` и другие встречаются на странице по 2 раза (логотип в шапке и в футере), и маска футера может взять `clipPath` из шапки. Генерируйте `id` через `useId()`:

```tsx
const id = useId();
<clipPath id={`${id}-clip`}>…</clipPath>
<g clipPath={`url(#${id}-clip)`}>…</g>
```

#### ⚪ Контраст «SODA THAT MAKES YOU SMILE»

По Lighthouse жёлтый на оранжевом `#fe6334` не проходит проверку контраста (ширина этой же секции — п.5). Буквы огромные, и для крупного текста нужно всего 3:1, но у этой пары меньше. Варианты: тёмно-синий текст бренда (как у заголовков выше) или более тёмный фон.

```diff
- <section className="… bg-[#fe6334]">
+ <section className="… bg-[#e0461a]">   {/* или text-[#0f2d4a] на текущем фоне */}
```

Проверьте итог в DevTools → «Contrast ratio».

#### ⚪ Уважать «уменьшить движение»

Вся страница — анимация на скролле. Пользователям с `prefers-reduced-motion` отдавайте статичный вариант:

```ts
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  // все scroll-анимации здесь; при reduce блок просто не выполнится
});
```

### 4.4 Безопасность

#### ⚪ Заголовки безопасности

Best Practices = 100, но Lighthouse отдельно отмечает (без влияния на оценку), что нет CSP, COOP и защиты от встраивания во фрейм. Минимальный набор для `next.config.ts`:

```ts
const securityHeaders = [
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // frame-ancestors вместо X-Frame-Options: разрешаем Prismic (симулятор слайсов)
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob: https://images.prismic.io",
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
      "connect-src 'self' https://*.prismic.io",
      "frame-ancestors 'self' https://*.prismic.io",
    ].join("; "),
  },
];

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

CSP сначала в режиме `Report-Only`: посмотрите в консоли, что она заблокировала бы, и только потом переименуйте заголовок в `Content-Security-Policy`.

### 4.5 Можно не трогать

- **Legacy JavaScript (14 КиБ)**: полифиллы `Array.prototype.at`, `Object.hasOwn` и др. в `06u36l06adngv.js`. Выигрыш маленький, и полифиллы может тянуть зависимость.
- **Render-blocking CSS (4,9 КиБ, 120 мс)**: для Next.js это норма, критический CSS вручную не выносите.
- **Source maps**: нужны только если подключите Sentry или похожий сервис. Тогда загружайте карты туда, а не публикуйте (`productionBrowserSourceMaps` не включайте).

---

## 5. UI/UX-рекомендации

Выводы сделаны по тому, что видно на страницах. Аналитики и интервью с пользователями не было, поэтому эффект стоит проверить метриками.

Главное: сайт красивый, но купить на нём нельзя, и навигации нет. Это ~9000px анимации без единого пути к корзине.

### 🔴 Превратить карусель во «вкус + покупка»

Сейчас «Choose Your Flavor» показывает название и «12 cans - $35.99», но ничего не даёт сделать. Это главное место для продажи: добавьте цену за банку, выбор количества и кнопку.

```tsx
<section id="flavors" className="carousel …">
  <div className="grid justify-items-center gap-3 text-white">
    <p aria-live="polite" className="text-4xl font-bold">
      {flavor.name}
    </p>
    <p className="text-lg">
      12 банок · $35.99 <span className="opacity-70">($3.00 за банку)</span>
    </p>

    <div className="flex items-center gap-3">
      <QuantityStepper value={qty} onChange={setQty} min={1} max={10} />
      <button
        onClick={() => addToCart(flavor.id, qty)}
        className="rounded-xl bg-white px-6 py-3 font-bold text-[#7c2d3b]"
      >
        Добавить в корзину
      </button>
    </div>
  </div>
</section>
```

Плюс индикатор, где ты в списке: 5 точек под банкой, по клику переход к вкусу.

```tsx
<div role="tablist" aria-label="Вкусы" className="flex gap-2">
  {flavors.map((f, i) => (
    <button
      key={f.id}
      role="tab"
      aria-selected={i === index}
      aria-label={f.name}
      onClick={() => goTo(i)}
      className={`size-3 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
    />
  ))}
</div>
```

И клавиатура со свайпом: стрелки ← → на секции, свайп на телефоне.

```ts
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };
  const el = sectionRef.current!;
  el.addEventListener("keydown", onKey);
  return () => el.removeEventListener("keydown", onKey);
}, []);
// для свайпа: @use-gesture/react → useDrag(({ swipe: [x] }) => x && (x < 0 ? next() : prev()))
```

### 🔴 Кнопка покупки всегда под рукой на мобильном

На телефоне кнопка есть только на первом экране. Добавьте нижнюю липкую панель, которая появляется после первого экрана:

```tsx
"use client";
import { useEffect, useState } from "react";

export function StickyBuyBar({ price, href }: { price: string; href: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 bg-white/90 px-4 py-3 shadow-[0_-4px_20px_rgb(0_0_0/0.08)] backdrop-blur transition-transform md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <span className="text-lg font-bold">{price}</span>
      <a href={href} className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white">
        Купить
      </a>
    </div>
  );
}
```

### 🟡 Минимальная навигация

В шапке только логотип (и тот не ссылка, п.6). Нужна короткая липкая шапка с двумя-тремя якорями и кнопкой:

```tsx
<header className="sticky top-0 z-50 flex items-center justify-between bg-yellow-300/80 px-4 py-2 backdrop-blur">
  <Link href="/" aria-label="Fizzi — на главную">
    <FizziLogo className="h-10" />
  </Link>
  <nav className="hidden gap-6 font-semibold md:flex">
    <a href="#flavors">Вкусы</a>
    <a href="#benefits">Польза</a>
  </nav>
  <a href="#flavors" className="rounded-lg bg-orange-600 px-4 py-2 font-bold">
    Купить
  </a>
</header>
```

### 🟡 Что-то видно, пока грузится 3D

На медленном интернете или слабом телефоне человек сначала видит пустой фон (на плёнке Lighthouse при Slow 4G — белые кадры, потом чёрный; фон исправляется в 4.2 «Чёрный кадр при загрузке»). Покажите статичную картинку той же сцены и плавно замените её на 3D:

```tsx
<div className="relative h-screen">
  <Image src="/hero-poster.webp" alt="" fill priority className="object-contain" />
  <Suspense fallback={null}>
    <Canvas className="absolute inset-0" onCreated={() => setReady(true)}>
      …
    </Canvas>
  </Suspense>
</div>
```

Постер = скриншот сцены в финальной позе, в WebP до 100 КБ. Это ещё и страховка для устройств без WebGL.

### 🟡 Текст всегда читается

Кроме текста на банке (п.2) и контраста «SODA THAT MAKES YOU SMILE» (4.3), бледно читается полупрозрачный заголовок «DIVE INTO BETTER HEALTH» на светло-голубом фоне. Правило: у текста всегда своя подложка или тень, и контраст не ниже 4.5:1 (для крупных заголовков — 3:1).

```css
.text-on-media {
  text-shadow:
    0 1px 2px rgb(0 0 0 / 0.5),
    0 0 24px rgb(0 0 0 / 0.35);
}
```

Проверка: DevTools → Elements → выбрать текст → Styles → квадрат цвета → «Contrast ratio».

### 🟡 Ответить на вопросы покупателя

Состав и калорийность сейчас видны только мелко на 3D-банке. Под блоками «Gut-Friendly» / «Light Calories» добавьте раскрывающиеся ответы. Без JS это делается через `<details>`:

```tsx
<details className="rounded-xl bg-white/60 p-4">
  <summary className="cursor-pointer font-bold">Состав и пищевая ценность</summary>
  <dl className="mt-3 grid grid-cols-2 gap-1 text-sm">
    <dt>Калории</dt>
    <dd>20 ккал</dd>
    <dt>Сахар</dt>
    <dd>3–5 г</dd>
    <dt>Клетчатка</dt>
    <dd>9 г</dd>
  </dl>
</details>
```

Сюда же: доставка, возврат, срок годности. Если есть настоящие отзывы — блок с ними перед финальным «SODA THAT MAKES YOU SMILE». Футер сейчас состоит из одного логотипа: добавьте контакты, соцсети, политику конфиденциальности.

### ⚪ Подсказать, что страницу надо листать

Первый экран заканчивается кнопкой, а дальше длинные анимации на скролле. Добавьте маленькую стрелку внизу, которая исчезает после первого скролла:

```tsx
<div
  aria-hidden
  className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce motion-reduce:animate-none"
>
  ↓
</div>
```

---

## 6. Чеклист перед релизом

- [ ] «SHOP NOW» и кнопки в карусели ведут к покупке (`href` не пустой)
- [ ] Цена и кнопка покупки видны в любом месте страницы (на мобильном — липкая панель)
- [ ] На 375–390px текст не лежит на банке, ничего не шире экрана
- [ ] Нет пустых экранов при прокрутке
- [ ] В консоли нет ошибок и `console.log`
- [ ] Есть `<title>`, description, og-теги; у 404 есть ссылка домой
- [ ] Картинки из Prismic отдаются с `sizes`, внешних файлов с GitHub/gstatic нет
- [ ] Карусель листается стрелками клавиатуры и свайпом
- [ ] Пока грузится 3D, виден постер, а не пустой фон
- [ ] При `prefers-reduced-motion: reduce` ничего не крутится само
- [ ] Lighthouse (мобильный): SEO ≥ 95, TBT < 200 мс, контраст без замечаний
