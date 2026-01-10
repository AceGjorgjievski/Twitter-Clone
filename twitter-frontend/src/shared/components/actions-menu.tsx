import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useState } from "react";
import { TweetActionItem } from "@/types";



type Props = {
  options: TweetActionItem[];
  showIcon?: boolean;
  anchorElProp?: HTMLElement | null;
  onClose?: () => void;
};

const ITEM_HEIGHT = 48;

export default function ActionsMenu({
  options,
  showIcon = true,
  anchorElProp,
  onClose,
}: Props) {
  const [internalAnchorEl, setInternalAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const anchorEl = anchorElProp ?? internalAnchorEl;
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setInternalAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setInternalAnchorEl(null);
    onClose?.();
  };

  return (
    <>
      {showIcon && (
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen(e);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "max-content",
            },
          },
          list: {
            "aria-labelledby": "long-button",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={(e) => {
              e.stopPropagation();
              option.onClick();
              handleClose();
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
