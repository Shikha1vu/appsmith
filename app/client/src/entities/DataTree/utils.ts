import { DataTreeWidget } from "./dataTreeFactory";
import {
  PropertyOverrideDependency,
  OverridingPropertyPaths,
  OverridingPropertyType,
} from "./types";

type SetOverridingPropertyParams = {
  key: string;
  value: string;
  propertyOverrideDependency: PropertyOverrideDependency;
  overridingPropertyPaths: OverridingPropertyPaths;
  type: OverridingPropertyType;
};

export const setOverridingProperty = ({
  key: propertyName,
  overridingPropertyPaths,
  propertyOverrideDependency,
  type,
  value: overridingPropertyKey,
}: SetOverridingPropertyParams) => {
  if (!(propertyName in propertyOverrideDependency)) {
    propertyOverrideDependency[propertyName] = {
      [OverridingPropertyType.DEFAULT]: undefined,
      [OverridingPropertyType.META]: undefined,
    };
  }
  switch (type) {
    case OverridingPropertyType.DEFAULT:
      propertyOverrideDependency[propertyName][
        OverridingPropertyType.DEFAULT
      ] = overridingPropertyKey;
      break;

    case OverridingPropertyType.META:
      propertyOverrideDependency[propertyName][
        OverridingPropertyType.META
      ] = overridingPropertyKey;

      break;
    default:
  }

  if (Array.isArray(overridingPropertyPaths[overridingPropertyKey])) {
    const updatedOverridingProperty = new Set(
      overridingPropertyPaths[overridingPropertyKey],
    );
    overridingPropertyPaths[overridingPropertyKey] = [
      ...updatedOverridingProperty.add(propertyName),
    ];
  } else {
    overridingPropertyPaths[overridingPropertyKey] = [propertyName];
  }
  // if property dependent on metaProperty also has defaultProperty then defaultProperty will also override metaProperty on eval.
  const defaultPropertyName = propertyOverrideDependency[propertyName].DEFAULT;
  if (type === OverridingPropertyType.META && defaultPropertyName) {
    overridingPropertyPaths[defaultPropertyName].push(overridingPropertyKey);
  }
};

export const isMetaWidgetTemplate = (widget: DataTreeWidget) => {
  return !!widget.siblingMetaWidgets;
};

export const isWidgetDefaultPropertyPath = (
  widget: DataTreeWidget,
  propertyPath: string,
) => {
  for (const property of Object.keys(widget.propertyOverrideDependency)) {
    const overrideDependency = widget.propertyOverrideDependency[property];
    if (overrideDependency.DEFAULT === propertyPath) return true;
  }
  return false;
};
