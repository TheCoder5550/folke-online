import { memo } from "react";
import {create} from 'zustand';
import {combine, devtools} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import { useShallow } from "zustand/shallow";

const NUMBER_OF_ITEMS = 500;

interface Item {
  uuid: string;
  value: string;
}

const defaultList: Item[] = new Array(NUMBER_OF_ITEMS).fill({}).map((_, i) => ({
  uuid: i.toString(),
  value: getRandomString()
}));

export default function TestList() {
  const uuids = useListStore(useShallow((state) => state.getUUIDs()));

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {uuids.map((uuid, index) => (
          <ListItemMemo key={uuid} index={index} />
        ))}
      </div>
    </>
  )
}

interface ListItemProps {
  index: number;
}

function ListItem(props: ListItemProps) {
  const value = useListStore((state) => state.items[props.index].value);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const setItem = useListStore((state) => state.setItem);

  const change: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setItem(props.index, e.currentTarget.value);
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <span>{props.index}</span>
      <input value={value} onChange={change} />
    </div>
  )
}

const ListItemMemo = memo(ListItem);

const useListStore = create(devtools(immer(
  combine({
    items: defaultList.slice(),
  },
  (set, get) => ({
    setItem(index: number, newValue: string) {
      set(state => {
        state.items[index].value = newValue;
      });
    },
    getUUIDs() {
      return get().items.map(i => i.uuid);
    }
  })),
)));

function getRandomString() {
  return (Math.random() + 1).toString(36).substring(7);
}