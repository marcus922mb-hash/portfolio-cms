import type { TemplateGroup } from "@/features/templates/types";
import type { BuilderComponent } from "@/features/builder/types";

const PEXELS_IMAGES: Record<TemplateGroup, readonly string[]> = {
  handmade: [
    "https://images.pexels.com/photos/33878971/pexels-photo-33878971.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/18373966/pexels-photo-18373966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/33633350/pexels-photo-33633350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/8063840/pexels-photo-8063840.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/33878979/pexels-photo-33878979.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/9243959/pexels-photo-9243959.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  beauty: [
    "https://images.pexels.com/photos/12115016/pexels-photo-12115016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/37229304/pexels-photo-37229304.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/3985331/pexels-photo-3985331.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/3985321/pexels-photo-3985321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/6663374/pexels-photo-6663374.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/6899550/pexels-photo-6899550.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  restaurant: [
    "https://images.pexels.com/photos/17318176/pexels-photo-17318176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/15689898/pexels-photo-15689898.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/6939758/pexels-photo-6939758.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/37708443/pexels-photo-37708443.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/18147861/pexels-photo-18147861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/32560859/pexels-photo-32560859.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  services: [
    "https://images.pexels.com/photos/23496897/pexels-photo-23496897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/16385070/pexels-photo-16385070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7709240/pexels-photo-7709240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/37680832/pexels-photo-37680832.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/8117463/pexels-photo-8117463.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7658240/pexels-photo-7658240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  medical: [
    "https://images.pexels.com/photos/7195195/pexels-photo-7195195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/8460084/pexels-photo-8460084.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/4309557/pexels-photo-4309557.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/6129444/pexels-photo-6129444.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/11370618/pexels-photo-11370618.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7579827/pexels-photo-7579827.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  creative: [
    "https://images.pexels.com/photos/3800848/pexels-photo-3800848.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7130237/pexels-photo-7130237.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/4268512/pexels-photo-4268512.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/20419525/pexels-photo-20419525.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/31761246/pexels-photo-31761246.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7383644/pexels-photo-7383644.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  ecommerce: [
    "https://images.pexels.com/photos/7289725/pexels-photo-7289725.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/5717978/pexels-photo-5717978.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/9218550/pexels-photo-9218550.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/19867474/pexels-photo-19867474.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/5650016/pexels-photo-5650016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/9595285/pexels-photo-9595285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  "one-page": [
    "https://images.pexels.com/photos/7857553/pexels-photo-7857553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7876659/pexels-photo-7876659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/36730468/pexels-photo-36730468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/4049877/pexels-photo-4049877.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/5974395/pexels-photo-5974395.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/6684766/pexels-photo-6684766.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  "link-in-bio": [
    "https://images.pexels.com/photos/13231906/pexels-photo-13231906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/38070794/pexels-photo-38070794.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/8276328/pexels-photo-8276328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/36318544/pexels-photo-36318544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/11265427/pexels-photo-11265427.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/8250095/pexels-photo-8250095.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
  "digital-card": [
    "https://images.pexels.com/photos/23496897/pexels-photo-23496897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7857553/pexels-photo-7857553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/3800848/pexels-photo-3800848.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/12115016/pexels-photo-12115016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/17318176/pexels-photo-17318176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "https://images.pexels.com/photos/7289725/pexels-photo-7289725.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ],
};

function hash(value: string) {
  let result = 0;
  for (const character of value) {
    result = (result * 31 + character.charCodeAt(0)) >>> 0;
  }
  return result;
}

export function templateImages(group: TemplateGroup, templateId: string) {
  const source = PEXELS_IMAGES[group];
  const offset = hash(templateId) % source.length;
  return Array.from(
    { length: source.length },
    (_, index) => source[(offset + index) % source.length]
  );
}

const IMAGE_PROP_KEYS = new Set([
  "avatarUrl",
  "backgroundImage",
  "imageUrl",
]);

export function hydrateTemplateImages(
  components: BuilderComponent[],
  urls: readonly string[]
): BuilderComponent[] {
  if (!urls.length) return components;

  let cursor = 0;
  const nextImage = () => {
    const image = urls[cursor % urls.length];
    cursor += 1;
    return image;
  };

  const hydrateValue = (value: unknown, key?: string): unknown => {
    if (key && IMAGE_PROP_KEYS.has(key)) return nextImage();
    if (Array.isArray(value)) {
      return value.map((item) => hydrateValue(item));
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([childKey, childValue]) => [
          childKey,
          hydrateValue(childValue, childKey),
        ])
      );
    }
    return value;
  };

  const hydrateComponent = (component: BuilderComponent): BuilderComponent => ({
    ...component,
    props: hydrateValue(component.props) as Record<string, unknown>,
    children: component.children.map(hydrateComponent),
  });

  return components.map(hydrateComponent);
}
