import { ColumnDef } from '@tanstack/react-table';

export type OrderColumn = {
    id: string;
    phone?: string;
    address?: string;
    isPaid: boolean;
    totalAmount: string;
    products: string;
    createdAt: string;
    status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  };
  

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'products',
    header: 'Products',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
  },
  {
    accessorKey: 'isPaid',
    header: 'Paid',
    cell: ({ row }) => (row.original.isPaid ? 'Yes' : 'No'), 
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
];
