"use client";

import { Card, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { FileXIcon, Plus, SearchIcon } from "lucide-react";

export default function ProductTable({
  columns = [],
  rows = [],
  currentPage = 1,
  heading,
  addButton,
  isPagination = true,
  totalPages = 1,
  setCurrentPage,
  loading,
  onAddButton,
  status,
  onStatus,
  search,
  onClearSearch,
  setSearch,
}) {
  return (
    <Card className="dark:bg-dark  mx-auto dark:border dark:border-darkBorder">
      <CardHeader className="block sm:flex pb-0 px-4  items-center justify-between urbanist_semibold  text-2xl">
        {heading}
        <div className="flex mt-3 sm:mt-0 justify-end items-center gap-3 w-full sm:w-auto">
          {addButton && (
            <Button
              size="sm"
              startContent={<Plus size={18} />}
              variant="flat"
              color="default"
              onPress={onAddButton}
            >
              {addButton}
            </Button>
          )}
          {setSearch && (
            <Input
              isClearable
              classNames={{
                inputWrapper:
                  "border-1 border-default-200 dark:border-default-100",
                input: "focus:outline-none border-none outline-none",
              }}
              className="w-full sm:max-w-xs"
              size="sm"
              variant="bordered"
              placeholder="Search here"
              startContent={<SearchIcon size={17} />}
              value={search}
              onClear={onClearSearch}
              onValueChange={setSearch}
            />
          )}
          {status && (
            <Select
              defaultSelectedKeys={[`${status?.title}`]}
              onSelectionChange={onStatus}
              className="max-w-xs"
              size="sm"
            >
              {status?.items?.map((s) => (
                <SelectItem key={s.key}>{s.label}</SelectItem>
              ))}
            </Select>
          )}
        </div>
      </CardHeader>
      <Table
        classNames={{
          // base:'dark:bg-[#4d4d4d47] backdrop-blur-3xl',
          // tbody: 'bg-transparent' ,
          // thead: 'bg-transparent' ,
          // table: 'bg-transparent' ,
          // emptyWrapper:'bg-transparent'
          wrapper: `dark:bg-dark  border-none shadow-none  backdrop-blur-3xl`,
        }}
        aria-label="Paginated Table"
        bottomContent={
          isPagination && rows.length > 0 ? (
            <div className="w-full flex justify-center">
              <Pagination
                isCompact
                showControls
                showShadow={totalPages > 3}
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody
          loadingContent={<Spinner color="primary" label="Loading..." />}
          isLoading={loading}
          // emptyContent={
          //   <div className="flex flex-col items-center justify-center">
          //     <FileXIcon className="w-12 h-12 " />
          //     <p className="text-center select-none capitalize text-sm urbanist_medium p-2">
          //       No data found
          //     </p>
          //   </div>
          // }
        >
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col.key}>{row[col.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
