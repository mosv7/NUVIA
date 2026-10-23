import React from 'react';
import { useProductView } from '../../app/providers/ProductProvider.jsx';

export default function NavigationIcon({ src, destination }) {
  const { activeDestination } = useProductView();
  return (
    <span
      aria-hidden="true"
      className="workspace-navigation-icon"
      data-active={activeDestination === destination}
      style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` }}
    />
  );
}
