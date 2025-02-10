"use client";

import { FC, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { Delete, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Image from "next/image";

type Platform = {
  name: string;
  enabled: boolean;
};

type Share = {
  id: number;
  description: string;
  platforms: Platform[];
};

const Share: FC = () => {
  const [rows, ] = useState<Share[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const platformsData = [
    { name: "facebook", enabled: true },
    { name: "x", enabled: true },
    { name: "instagram", enabled: true },
    { name: "pinterest", enabled: true },
  ];

  const itemsData: Share[] = [
    { id: 555, description: "Desc", platforms: platformsData },
    { id: 777, description: "Desc", platforms: platformsData },
    { id: 888, description: "Desc", platforms: platformsData },
  ];

  const [items, setItems] = useState<Share[]>(itemsData);

  const changePlatformState = (
    shareId: number,
    name: string,
    enabled: boolean
  ) => {
    const updatedItems = items.map((share) => {
      if (share.id === shareId) {
        const updatedPlatforms = share.platforms.map((platform) => {
          if (platform.name === name) {
            return { ...platform, enabled: enabled };
          }
          return platform;
        });
        return { ...share, platforms: updatedPlatforms };
      }
      return share;
    });

    setItems(updatedItems);
  };

  const handleChangePage = (page: number) => {
    console.log(page)
  };

  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  function labelDisplayedRows({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  }

  const getLabelDisplayedRowsTo = () => {
    if (rows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? rows.length
      : Math.min(rows.length, (page + 1) * rowsPerPage);
  };

  return (
    <>
      <Table variant="plain">
        <thead>
          <tr>
            <td width="3%">ID</td>
            <td width="74%">Description</td>
            <td width="18%">Platforms</td>
            <td width="5%"></td>
          </tr>
        </thead>
        <tbody>
          {items.map((share: Share, index: number) => (
            <tr key={index}>
              <td>
                <a href="#">{share.id}</a>
              </td>
              <td>
                <Input name={share.description} />
              </td>
              <td>
                <Stack flexDirection="row">
                  {share.platforms.map((platform: Platform, index: number) => (
                    <Stack
                      key={index}
                      flexDirection="row"
                      style={{ marginRight: "10px" }}
                    >
                      <Checkbox
                        onChange={(e) =>
                          changePlatformState(
                            share.id,
                            platform.name,
                            e.target.checked
                          )
                        }
                        checked={platform.enabled}
                        color="primary"
                        size="sm"
                        label={
                          <Image
                            src={`/socials/${platform.name}.svg`}
                            width={16}
                            height={16}
                            alt=""
                          />
                        }
                      />
                    </Stack>
                  ))}
                </Stack>
              </td>
              <td style={{ textAlign: "center" }}>
                <IconButton>
                  <Delete />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select
                    onChange={handleChangeRowsPerPage}
                    value={rowsPerPage}
                  >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                <Typography sx={{ textAlign: "center", minWidth: 80 }}>
                  {labelDisplayedRows({
                    from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: rows.length === -1 ? -1 : rows.length,
                  })}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => handleChangePage(page - 1)}
                    sx={{ bgcolor: "background.surface" }}
                  >
                    <KeyboardArrowLeft/>
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={
                      rows.length !== -1
                        ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                        : false
                    }
                    onClick={() => handleChangePage(page + 1)}
                    sx={{ bgcolor: "background.surface" }}
                  >
                    <KeyboardArrowRight/>
                  </IconButton>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
};

export default Share;
