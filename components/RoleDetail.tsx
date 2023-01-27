import React from 'react';

interface RoleDetailProps {
  id: string,
  name: string,
  acronym: string,
  description: string,
}

export const RoleDetail = ({
  id,
  name,
  acronym,
  description,
}: RoleDetailProps) => {
  return (
    <div className="shadow  max-w-md  rounded">
      <div className="p-5 flex flex-col space-y-2">
        <p className="text-sm text-blue-500">{name}</p>
        <p className="text-lg font-medium">{acronym}</p>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};
